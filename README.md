# Create default
* npm init
* npm i express mongoose
* npm i cors dotenv bcrypt cookie-parser jsonwebtoken

# AUTHENTICATION (Login, Register)
# AUTHORIZATION (Phan quyen)
# Schema ( khung xuong cho model)
# JWT( xac thuc users)
Một JWT bao gồm ba phần: header, payload và signature. Header chứa loại token và thuật toán mã hóa được sử dụng, payload chứa các thông tin mà bạn muốn truyền tải (ví dụ: thông tin người dùng, quyền truy cập), và signature được tạo ra bằng cách ký và mã hóa header và payload bằng một khóa bí mật, điều này đảm bảo tính toàn vẹn của JWT.
# env(private key)
# SAVE TOKEN
* 1 local storage
* 2 http only cookies
* 3 redux storage -> access token and http only cookies ->refresh token
* 4 BFF patterns -> backend for frontend( fake server)
# Redux toolkit
# Axios + navigate
# Bcrypt(hash)

