class IngeByggBaseError extends Error{}

class InvalidCredentials extends IngeByggBaseError{
  constructor(){
    super()
    this.message = `Invalid credentials`
    this.errorCode = 403
  }
}
class Unauthorized extends IngeByggBaseError{
  constructor(){
    super()
    this.message = `Unauthorized`
    this.errorCode = 401
  }
}
class Forbidden extends IngeByggBaseError{
  constructor(){
    super()
    this.message = `Forbidden`
    this.errorCode = 403
  }
}

class TokenExpired extends IngeByggBaseError{
  constructor(){
    super()
    this.message = `Token expired, please log in again`
    this.errorCode = 401
  }
}

class MissingHeader extends IngeByggBaseError{
  constructor(){
    super()
    this.message = `Content-Type header is missing`
    this.errorCode = 400
  }
}
class InvalidFile extends IngeByggBaseError{
  constructor(message){
    super()
    this.message = message
    this.errorCode = 400
  }
}
class FileExists extends IngeByggBaseError{
  constructor(fileName){
    super()
    this.message = fileName + " already exists. Please change the name and upload again"
    this.errorCode = 500
  }
}

module.exports = {
  IngeByggBaseError,
  InvalidCredentials,
  Unauthorized,
  TokenExpired,
  Forbidden,
  MissingHeader,
  InvalidFile,
  FileExists
}