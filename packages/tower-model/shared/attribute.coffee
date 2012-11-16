_ = Tower._

Tower.transforms =
  string: Tower.StoreSerializerString

# Tower.field('string')
# Tower.field(type: 'string')
# Tower.field('string', default: 'asdf')
# Tower.field('string', default: 'asdf').validates('presence')
# Tower.field('string', default: 'asdf').validates('presence').index()
Tower.field = (type, meta) ->
  if _.isHash(type)
    meta = type
  else
    meta ||= {}
    meta.type = type

  transform     = Tower.transforms[meta.type]#Tower.Field.transforms[meta.type]
  meta.transformFrom = transform.from
  meta.transformTo   = transform.to

  meta.isField  = true

  cp = new Tower.Field (key, value) ->
    if arguments.length == 1
      value = @getAttribute(key)
    else
      value = meta.transformTo(value)
      @setAttribute(key, value)

    unless value?
      @default

    meta.transformFrom(value)

  cp.meta(meta)

  cp

# @todo needs lots of refactoring
class Tower.ModelAttribute extends Ember.ComputedProperty
  # @example Datatypes
  #   'boolean'
  #   'integer'
  #   'decimal' (double)
  #   'long' (double)
  #   'bigint'
  #   'float'
  #   'date'
  #   'time'
  #   'datetime'
  #   'timestamp'
  #   'string'
  #   'text'
  #   'binary'
  #   'object' == 'blob' == anything
  #   'hash'
  #   'array'
  #   'reference' == id of related document
  #   'geo'
  #   # https://github.com/joelmoss/bitmask_attributes
  #   'bitmask' == enumerable (array) that gets transformed into an integer for storage compression
  # 
  # @example Other data types
  #   'id'
  #   'bigint'
  # @option options [Boolean|String|Function] set If `set` is a boolean, it will look for a method
  #   named `"set#{field.name}"` on the prototype.  If it's a string, it will call that method on the prototype.
  #   If it's a function, it will call that function as if it were on the prototype.
  wire: (owner, name, options = {}, block) ->
    @owner        = owner
    @name         = key = name

    if typeof options == 'string'
      options       = type: options
    else if typeof options == 'function'
      block         = options
      options       = {}

    @type           = type = options.type || 'String'

    if typeof type != 'string'
      @itemType     = type[0]
      @type         = type = 'Array'

    @encodingType = switch type
      when 'Id', 'Date', 'Array', 'String', 'Integer', 'Float', 'BigDecimal', 'Time', 'DateTime', 'Boolean', 'Object', 'Number', 'Geo'
        type
      else
        'Model'

    observes = _.castArray(options.observes)
    observes.push('data')
    @observes = observes

    @_setDefault(options)
    @_defineAccessors(options)
    @_defineAttribute(options)
    @_addValidations(options)
    @_addIndex(options)

    @

  _setDefault: (options) ->
    @_default = options.default

    unless @_default
      if @type == 'Geo'
        @_default = lat: null, lng: null
      else if @type == 'Array'
        @_default = []

  _defineAccessors: (options) ->
    name        = @name
    type        = @type

    serializer  = Tower['StoreSerializer' +type]

    @get        = options.get || (serializer.from if serializer)

    if serialize = (options.serialize || options.encode)
      # serialize = "to#{_.camelize(serialize)}"
      # this might be too much but it would be useful to abstract away in a cleaner way
      if _[serialize] # underscore helper
        observed = @observes.length == 2 && @observes[0] # the first property
        @get    = ->
          _[serialize](@get(observed))
      else
        @get    = true
    @set      = options.set || (serializer.to if serializer)

    @get        = "get#{_.camelize(name)}" if @get == true
    @set        = "set#{_.camelize(name)}" if @set == true

    #if Tower.accessors
    #  Object.defineProperty @owner.prototype, name,
    #    enumerable: true
    #    configurable: true
    #    get: -> @get(name)
    #    set: (value) -> @set(name, value)

  _defineAttribute: (options) ->
    name      = @name
    attribute = {}
    field     = @

    # There needs to be a way to customize this from the outside
    computed = Ember.computed((key, value) ->
      if arguments.length == 2
        value = field.encode(value, @)
        value = @setAttribute(key, value)
        # @todo this is having issues with App.MyModel.build
        # Tower.cursorNotification("#{@constructor.className()}.#{key}")
        value
      else
        value = @getAttribute(key)
        value = field.defaultValue(@) if value == undefined
        field.decode(value, @)
      ###
      if arguments.length is 2
        data  = Ember.get(@, 'data')
        value = data.set(key, field.encode(value, @))
        # this is for associations, built for hasMany through. 
        # need to think about some more but it works for now.
        # you can save hasMany through, with async is true.
        if Tower.isClient && key == 'id'
          cid = data.get('_cid')
          if cid and cid != data.get('_id')
            relations = @constructor.relations()
            for relationName, relation of relations
              if relation.isHasMany || relation.isHasOne
                foreignKey = relation.foreignKey
                relation.klass().where(foreignKey, cid).all().forEach (item) ->
                  item.set(foreignKey, value)
      
        # probably should put this into Tower.ModelData:
        Tower.cursorNotification("#{@constructor.className()}.#{key}")
        value
      else
        data  = Ember.get(@, 'data')
        value = data.get(key)
        value = field.defaultValue(@) if value == undefined
        field.decode(value, @)
      ###
    )

    attribute[name] = computed.property.apply(computed, @observes).cacheable()

    #@owner.prototype[name] = attribute[name]
    #@owner.reopen(attribute)
    # testing out some of the depths of the ember api and some performance enhancements
    mixins      = @owner.PrototypeMixin.mixins
    properties  = mixins[mixins.length - 1].properties
    if properties
      properties[name] = attribute[name]
    else
      @owner.reopen(attribute)

  _addValidations: (options) ->
    validations           = {}

    for key, normalizedKey of Tower.ModelValidator.keys
      validations[normalizedKey] = options[key] if options.hasOwnProperty(key)

    @owner.validates @name, validations if _.isPresent(validations)

  # field.validates('presence')
  # field.validates(presence: true)
  # field.validates('presence', if: 'isOkay') # not sure about this one
  # field.validates('presence', 'unique')
  # field.validates('presence').validates('unique')
  # field.validates(presence: true).validates(unique: true)
  # field.validates(presence: true, unique: value: true)
  # field.validates(unique: value: true, if: 'somethingElseIsTrue', message: 'hey there')
  # @example If first is string
  #   # then the next can be either a function (the `if` part),
  #   # a string, the message
  #   # or an object, with {value: true, message: x}
  #   # and any combination/order.
  #   field.validates('unique', 'Not unique', -> @ != @)
  #   - the 'msg' as a second operator is only known by testing it against Tower.validations
  #   - if the second string isn't found in Tower.validations, it's a message
  #   field.validates('unique', msg, fn)
  #   field.validates('unique', fn, msg)
  #   field.validates('unique', opts, msg)
  #   field.validates('unique', msg, opts)
  #   field.validates('unique', fn, opts)
  #   field.validates('unique', opts, fn)
  #   field.validates('unique', opts)
  #   field.validates('unique', fn)
  #   field.validates('unique', msg)
  # 
  # @example If first is an object, all have to be objects
  #   field.validates(unique: true)
  #   field.validates({unique: true}, {presence: true})
  #   field.validates({unique: true}, {presence: true})
  #   field.validates({unique: true}, {presence: true})
  #   field.validates({unique: true}, {presence: true})
  # 
  # @example If first is a function
  #   # - can do the `if` check in the function itself if you want
  #   field.validates((-> 'a' != 'b'), 'Something invalid', on: 'create', if: ->)
  #   field.validates(fn, msg, opts)
  #   field.validates(fn, opts, msg)
  #   field.validates(fn, opts)
  #   field.validates(fn, msg)
  # 
  # If you want the message to be more dynamic, and use a function, 
  # you have to define it in the options hash: `message: -> 'x'`
  # 
  # field.validates('presence', unique: true)
  # field.validates((key, value) -> value != false) # can return true/1/[object], false/0, or null/undefined
  # field.validates('presence').validates('in', [1, 2, 3])
  # field.validates('presence').validates('in', -> if x then [1, 2, 3] else null)
  validates: ->
    args  = _.args(arguments)
    map   = Tower.validations
    meta  = @meta()
    validations = meta.validations ||= []
    options = undefined
    test = undefined
    validation = undefined
    
    if _.isString(args[0])
      if Tower.validations[args[1]]
        # splat
        fields = args.splice(0, 2)

        while _.isString(args[0])
          arg = args.shift()
          throw new Error('Invalid validation') unless map[arg]
          fields.push(arg)

        while arg = args.shift()
          if _.isString(arg)
            throw new Error('Invalid validation')
          else if _.isFunction(arg)
            test ||= arg
          else if _.isHash(arg)
            options ||= arg

        options ||= {}
        options.if = test if test

        _.each fields, (key) ->
          validations.push(_.extend(validate: Tower.validations[key], options))
      else
        validate = Tower.validations[args.shift()]

        while arg = args.shift()
          if _.isString(arg)
            message = arg
          else if _.isFunction(arg)
            test = arg
          else
            meta = arg

        validation ||= {}
        validation.if = test if test
        validation.message = message if message
        validation.validate = validate
        validations.push(validation)
    else if _.isFunction(args[0])
      validate = args.shift()
      while arg = args.shift()
        if _.isString(arg)
          message = arg
        else if _.isHash(arg)
          validation = arg

      validation.validate = validate
      validation.message = message if message
      validations.push(validation)
    else
      if _.isFunction(args[args.length - 1])
        test = args.pop()
      while arg = args.shift()
        options     = _.moveProperties({}, arg, 'on', 'if', 'unless', 'allow', 'scope')
          
        for key, value of arg          
          validate = Tower.validations[key]

          throw new Error('Invalid validation') unless validate

          if _.isHash(value)
            validation = _.defaults(value, options)
          else
            validation = _.extend({}, options)

          validation.if ||= test if test
          validation.validate = validate
          validations.push(validation)

    @

  index: (value = true) ->
    meta = @meta()
    meta.index = value

    @

  _addIndex: (options) ->
    type  = @type
    name  = @name

    if type == 'Geo' && !options.index
      index       = {}
      index[name] = '2d'
      options.index = index

    if options.index
      if options.index == true
        @owner.index(@name)
      else
        @owner.index(options.index)

  validators: ->
    result = []
    for validator in @owner.validators()
      result.push(validator) if validator.attributes.indexOf(@name) != -1
    result

  defaultValue: (record) ->
    _default = @_default

    return _default unless _default?

    if _.isArray(_default)
      _default.concat()
    else if _.isHash(_default)
      _.extend({}, _default)
    else if typeof(_default) == 'function'
      _default.call(record)
    else
      _default

  encode: (value, binding) ->
    @code @set, value, binding

  decode: (value, binding) ->
    @code @get, value, binding

  code: (type, value, binding) ->
    switch typeof type
      when 'string'
        binding[type].call binding[type], value
      when 'function'
        type.call binding, value
      else
        value

  # @todo for the pure javascript version we're going to need to have this method.
  attach: (owner) ->

module.exports = Tower.Field = Tower.ModelAttribute