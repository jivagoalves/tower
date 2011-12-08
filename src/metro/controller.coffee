class Metro.Controller extends Metro.Object
  constructor: ->
    @headers      = {}
    @status       = 200
    @request      = null
    @response     = null
    @contentType = "text/html"
    @params       = {}
    @query        = {}

require './controller/caching'
require './controller/helpers'
require './controller/http'
require './controller/layouts'
require './controller/redirecting'
require './controller/rendering'
require './controller/responding'

Metro.Controller.include Metro.Controller.Caching
Metro.Controller.include Metro.Controller.Helpers
Metro.Controller.include Metro.Controller.HTTP
Metro.Controller.include Metro.Controller.Layouts
Metro.Controller.include Metro.Controller.Redirecting
Metro.Controller.include Metro.Controller.Rendering
Metro.Controller.include Metro.Controller.Responding

module.exports = Metro.Controller