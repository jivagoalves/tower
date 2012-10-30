_ = Tower._

# Tower.Model.field(); // defaults to 'string'
# Tower.Model.field('boolean');
# Tower.Model.field('boolean', {default: false});
# Tower.Model.field('boolean', {default: false}).validates('presence');
# Tower.Model.field('boolean', {default: false, presence: true});
# Tower.Model.field({type: 'boolean'});
jsField = (type, options) ->
  if _.isHash(type)
    options = type
  else
    type ||= 'string'
  
  options ||= {}

  if typeof options == 'string'
    options       = type: options
  else if typeof options == 'function'
    block         = options
    options       = {}

  shortKey       = options.shortKey if options.shortKey
  type           = type = options.type || 'String'

  if typeof type != 'string'
    itemType     = type[0]
    type = 'Array'

  encodingType = switch type
    when 'Id', 'Date', 'Array', 'String', 'Integer', 'Float', 'BigDecimal', 'Time', 'DateTime', 'Boolean', 'Object', 'Number', 'Geo'
      type
    else
      'Model'

  _default = options.default

  unless _default
    if type == 'Geo'
      _default = lat: null, lng: null
    else if @type == 'Array'
      _default = []

  serializer  = Tower['StoreSerializer' +type]

  get = options.get || (serializer.from if serializer)
  set = options.set || (serializer.to if serializer)

  meta =
    'default': _default
    encodingType: encodingType
    shortKey: shortKey
    type: type
    itemType: itemType
    isAttribute: true
    transformFrom: get
    transformTo: set

  meta.defaultValue = (record) ->
    _default = @['default']

    return _default unless _default?

    if _.isArray(_default)
      _default.concat()
    else if _.isHash(_default)
      _.extend({}, _default)
    else if typeof(_default) == 'function'
      _default.call(record)
    else
      _default

  Ember.computed((key, value) ->
    if arguments.length == 2
      value = meta.transformTo(value, @)
      value = @setAttribute(key, value)
      value
    else
      value = @getAttribute(key)
      value = meta.defaultValue(@) if value == undefined
      meta.transformFrom(value, @)
  ).cacheable().meta(meta)

jsFields = Ember.computed(->
  map = Ember.Map.create()

  @eachComputedProperty (name, meta) ->
    map.set(name, meta) if meta.isAttribute

  map
).cacheable()

# @mixin
Tower.ModelAttributes =
  Serialization: {}

  ClassMethods:
    jsFields: jsFields

    jsField: jsField

    # @todo there are no tests for this yet.
    dynamicFields: true

    # @todo this is not being used yet.
    primaryKey: 'id'

    # @todo
    # 
    # List of names you should not use as field names.
    destructiveFields: [
      'id'
      'push'
      'isValid'
      'data'
      'changes'
      'getAttribute'
      'setAttribute'
      'unknownProperty'
      'setUnknownProperty'
    ]

    # Define a database field on your model.
    #
    # The field can have one of several types.
    #
    # @example String field
    #   class App.User extends Tower.Model
    #     @field 'email'
    #
    # @param [String] name
    # @param [Object] options
    # @option options [String] type the data type for this field
    # @option option [Object] default default value
    # @option option [String] as shortened key to minimize JSON and mongodb storage size
    # @option option [String] alias same as `as`
    #
    # @return [Tower.ModelAttribute]
    field: (name, options) ->
      # @todo convert this to Ember.Map so it's an ordered set
      @fields()[name] = new Tower.ModelAttribute(@, name, options)

    # The set of fields for the model.
    #
    # @return [Object]
    fields: ->
      fields = @metadata().fields

      switch arguments.length
        when 0
          fields
        when 1
          @field(name, options) for name, options of arguments[0]
        else
          names   = _.args(arguments)
          options = _.extractOptions(names)
          @field(name, options) for name in names

      fields

    # @todo need to reset on file reload
    longKeysToShortKeys: ->
      return @_longKeysToShortKeys if @_longKeysToShortKeys

      ABC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').sort()
      nextABC = (char) ->
        if (index = _.indexOf(ABC, char, true)) > -1 || (index = _.indexOf(ABC, char.toUpperCase(), true)) > -1
          ABC.splice(index, 1)[0]
        else
          ABC.shift()

      fields = @fields()
      result = {}

      # @todo maybe an option to make them semi-more readable, using
      #   "aA" for "activatedAt", instead of "z" or whatever.
      for name, field of fields
        result[name] = field.shortKey || nextABC(name.charAt(0))

      @_longKeysToShortKeys = result

    shortKeysToLongKeys: ->
      return @_shortKeysToLongKeys if @_shortKeysToLongKeys

      longKeysToShortKeys = @longKeysToShortKeys()
      result = {}

      for longKey, shortKey of longKeysToShortKeys
        result[shortKey] = longKey

      @_shortKeysToLongKeys = result

    # Returns a hash with keys for every attribute, and the default value (or `undefined`).
    # 
    # @private
    # 
    # @return [Object]
    _defaultAttributes: (record) ->
      attributes = {}

      for name, field of @fields()
        attributes[name] = field.defaultValue(record)

      attributes.type ||= @className() if @isSubClass()

      attributes

    initializeAttributes: (record, attributes) ->
      _.defaults(attributes, @_defaultAttributes(record))

    # attributeNames: Ember.computed ->

  InstanceMethods:
    dynamicFields: true

    attributes: Ember.computed(->
      throw new Error('Cannot set attributes hash directly') if arguments.length == 2

      {}
    ).cacheable()

    # Performs an operation on an attribute value.
    # 
    # You don't need to use this directly in most cases, instead use the helper methods
    # such as `push`, `set`, etc.
    modifyAttribute: (operation, key, value) ->
      operation = Tower.StoreModifiers.MAP[operation]
      operation = if operation then operation.replace(/^\$/, '') else 'set'

      @[operation](key, value)

    atomicallySetAttribute: ->
      @modifyAttribute(arguments...)

    # This takes in a params hash, usually straight from a request in a controller,
    # and makes sure you don't set any insecure/protected attributes unintentionally.
    assignAttributes: (attributes, options, operation) ->
      return unless _.isHash(attributes)
      options ||= {}

      unless options.withoutProtection
        options.as ||= 'default'
        attributes = @_sanitizeForMassAssignment(attributes, options.as)

      Ember.beginPropertyChanges()

      @_assignAttributes(attributes, options, operation)

      Ember.endPropertyChanges()

    unknownProperty: (key) ->
      @getAttribute(key) if @get('dynamicFields')

    setUnknownProperty: (key, value) ->
      @setAttribute(key, value) if @get('dynamicFields')

    getAttribute: (key) ->
      #@get('data').getAttribute(key)
      passedKey = key
      # @todo cleanup/optimize
      key = if key == '_id' then 'id' else key
      result = @_cid if key == '_cid'
      result = Ember.get(@get('attributes'), key) if result == undefined
      # in the "public api" we want there to be no distinction between cid/id, that should be managed transparently.
      result = @_cid if passedKey == 'id' && result == undefined
      result

    # @todo Use this to set an attribute in a more optimized way
    setAttribute: (key, value, operation) ->
      if key == '_cid'
        if value?
          @_cid = value
        else
          delete @_cid
        @propertyDidChange('id')
        return value

      if Tower.StoreModifiers.MAP.hasOwnProperty(key)
        key = key.replace('$', '')
        if key == 'set'
          @assignAttributes(value)
        else
          @[key](value)
      else
        # @todo need a better way to do this...
        if !@get('isNew') && key == 'id'
          @get('attributes')[key] = value
          return value

        @_actualSet(key, value)

      @set('isDirty', _.isPresent(@get('changedAttributes')))

      value

    _actualSet: (key, value, dispatch) ->
      @_updateChangedAttribute(key, value)

      @get('attributes')[key] = value# unless @record.constructor.relations().hasOwnProperty(key)

      # @todo refactor.
      #   Basically, if you do atomic operations on attributes there needs to be some
      #   way to tell ember to update bindings.
      @propertyDidChange(key) if dispatch

      value

    # @todo Use this to set multiple attributes in a more optimized way.
    setAttributes: (attributes) ->

    getEach: (fields...) ->
      _.map _.flatten(fields), (i) =>
        @get(i)

    # @todo same as below, might want to redo api
    # setAttributeWithOperation: (operation, key, value) ->

    # @todo handle multi-parameter attributes, such as the datepicker.
    # 
    # @private
    _assignAttributes: (attributes, options, operation) ->
      # such as with the datepicker, such as date(1) == month, date(2) == day, date(3) == year
      multiParameterAttributes  = []
      nestedParameterAttributes = []
      modifiedAttributes        = []

      # this recursion needs to be thought about again
      for k, v of attributes
        if k.indexOf('(') > -1
          multiParameterAttributes.push [ k, v ]
        else if k.charAt(0) == '$'
          @assignAttributes(v, options, k)
        else
          if _.isHash(v)
            nestedParameterAttributes.push [ k, v ]
          else
            @modifyAttribute(operation, k, v)

      # @assignMultiparameterAttributes(multiParameterAttributes)

      # assign any deferred nested attributes after the base attributes have been set
      for item in nestedParameterAttributes
        @modifyAttribute(operation, item[0], item[1])

#for method in Tower.StoreModifiers.SET
#  do (method) ->
#    Tower.ModelAttributesInstanceMethods[method] = ->
#      Ember.get(@, 'data')[method] arguments...

module.exports = Tower.ModelAttributes
