class ResponseEntity
  def initialize(body : String, status_code : Int32)
    @body = body
    @status_code = status_code
  end

  getter body, status_code
end
