![poster](./poster.png)
# slutprojekt-backend
Inge Bra Bygg AB
## Project setup
```
npm install
```
# Diagram v1.0
![diagram](./Backend-slutprojekt-white.png)

### EndPoints

| End Point | Method | Details | Request Body | Query
| ------ | ------ | ------ | ------ | ------ |
| /api/auth/ | POST | Authenticates user with email & password. Returns a JWT-token which can be used during every API call in Authorization-header. | {"email": "...", "password" : "..."} | ❌ |
| /api/registerclient/ | POST | Registers a client. | {
	"email":".....",
	"password":"....",
	"userName":"....",
	"role":"client"
} |  ❌ |
| /api/registerworker/ | POST | Registers a worker. | {
	"email":".....",
	"password":"....",
	"userName":"....",
	"role":"worker"
} |  ❌ |
