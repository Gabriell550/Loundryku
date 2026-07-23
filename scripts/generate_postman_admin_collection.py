from pathlib import Path

root = Path(r"C:/Users/nizar/OneDrive/Dokumen/Loundryku")
collection_root = root / "postman" / "collections" / "Loundryku Admin"

REQUESTS = {
    "login/admin-login.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/auth/login'
order: 1000
description: |-
  Endpoint ini dipakai untuk login Admin.

  Yang diuji:
  - request body login terkirim dengan benar
  - status code sukses sesuai harapan
  - response benar-benar JSON
  - token JWT ada dan disimpan ke environment

  Kenapa penting:
  Hampir semua endpoint Admin membutuhkan token. Kalau login gagal, request berikutnya juga akan gagal.
headers:
  - key: Content-Type
    value: application/json
body:
  type: json
  content: |-
    {
      "username": "{{admin_username}}",
      "password": "{{admin_password}}"
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      let jsonData;
      pm.test("Response harus JSON valid", function () {
        jsonData = pm.response.json();
        pm.expect(jsonData).to.be.an("object");
      });

      pm.test("Field success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("Message login harus benar", function () {
        pm.expect(jsonData.message).to.eql("Login berhasil");
      });

      pm.test("Token JWT harus ada", function () {
        pm.expect(jsonData.data).to.be.an("object");
        pm.expect(jsonData.data.token).to.be.a("string").and.not.empty;
      });

      pm.test("Field penting user login tidak boleh null", function () {
        pm.expect(jsonData.data.username).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.fullName).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.role).to.be.a("string").and.not.empty;
      });

      pm.environment.set("jwt_token", jsonData.data.token);
      pm.environment.set("logged_in_username", jsonData.data.username);
      pm.environment.set("logged_in_role", jsonData.data.role);
""",
    "login/admin-login-invalid-password.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/auth/login'
order: 2000
description: |-
  Endpoint ini menguji login gagal karena password salah.

  Yang diuji:
  - backend menolak credential yang salah
  - message error tetap jelas
  - response error tetap JSON

  Kenapa penting:
  Test negatif membantu memastikan sistem aman dan tidak menerima login yang salah.
headers:
  - key: Content-Type
    value: application/json
body:
  type: json
  content: |-
    {
      "username": "{{admin_username}}",
      "password": "wrong-password"
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code login gagal saat ini harus 404", function () {
        pm.response.to.have.status(404);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      let jsonData;
      pm.test("Response error harus JSON valid", function () {
        jsonData = pm.response.json();
        pm.expect(jsonData).to.be.an("object");
      });

      pm.test("Field success harus false", function () {
        pm.expect(jsonData.success).to.eql(false);
      });

      pm.test("Message error harus sesuai", function () {
        pm.expect(jsonData.message).to.eql("Username atau password salah");
      });
""",
    "users/create-user.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/users'
order: 1000
description: |-
  Endpoint ini dipakai Admin untuk membuat user baru.

  Yang diuji:
  - token JWT dikirim
  - request body valid
  - data user baru berhasil dibuat
  - id user hasil create disimpan ke environment

  Kenapa penting:
  Ini memastikan fitur manajemen user berjalan dan data penting bisa dipakai request berikutnya.
headers:
  - key: Content-Type
    value: application/json
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
body:
  type: json
  content: |-
    {
      "username": "kasir1",
      "password": "secret1",
      "fullName": "Kasir Satu",
      "role": "KASIR"
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 201", function () {
        pm.response.to.have.status(201);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("Field success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("Message create user harus benar", function () {
        pm.expect(jsonData.message).to.eql("Akun berhasil dibuat");
      });

      pm.test("Data user penting tidak boleh null", function () {
        pm.expect(jsonData.data.id).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.username).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.fullName).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.role).to.be.a("string").and.not.empty;
      });

      pm.environment.set("admin_user_id", jsonData.data.id);
""",
    "users/create-user-duplicate.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/users'
order: 4000
description: |-
  Endpoint ini menguji pembuatan user dengan username yang sudah dipakai.

  Yang diuji:
  - backend menolak data duplikat
  - status code error benar
  - message error jelas

  Kenapa penting:
  Validasi duplikasi mencegah bentrok data user di database.
headers:
  - key: Content-Type
    value: application/json
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
body:
  type: json
  content: |-
    {
      "username": "admin",
      "password": "admin123",
      "fullName": "Administrator",
      "role": "ADMIN"
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code duplicate user harus 400", function () {
        pm.response.to.have.status(400);
      });

      pm.test("Response error harus cepat", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("Field success harus false", function () {
        pm.expect(jsonData.success).to.eql(false);
      });

      pm.test("Message duplicate harus sesuai", function () {
        pm.expect(jsonData.message).to.include("Username sudah dipakai");
      });
""",
    "users/list-users.request.yaml": """$kind: http-request
method: GET
url: '{{base_url}}/api/users'
order: 2000
description: |-
  Endpoint ini mengambil daftar user yang bisa dilihat Admin.

  Yang diuji:
  - token JWT diterima
  - response berbentuk array pada data
  - jika ada data, id pertama bisa disimpan untuk test berikutnya

  Kenapa penting:
  Endpoint list biasanya dipakai untuk audit data, monitoring, dan memilih data untuk edit atau delete.
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message list user harus benar", function () {
        pm.expect(jsonData.message).to.eql("Berhasil mengambil data user");
      });

      pm.test("data harus berupa array", function () {
        pm.expect(jsonData.data).to.be.an("array");
      });

      if (Array.isArray(jsonData.data) && jsonData.data.length > 0) {
        pm.environment.set("admin_user_id", jsonData.data[0].id);
      }
""",
    "users/delete-user.request.yaml": """$kind: http-request
method: DELETE
url: '{{base_url}}/api/users/{{admin_user_id}}'
order: 3000
description: |-
  Endpoint ini menghapus user berdasarkan id.

  Yang diuji:
  - path variable id terkirim
  - endpoint delete memberi response sukses
  - wrapper response tetap konsisten walau data null

  Kenapa penting:
  Delete harus aman dan jelas supaya data yang dihapus benar-benar sesuai target.
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code delete user harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message delete user harus benar", function () {
        pm.expect(jsonData.message).to.eql("User berhasil dihapus");
      });
""",
    "service types/create-service-type.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/service-types'
order: 1000
description: |-
  Endpoint ini membuat jenis layanan laundry baru.

  Yang diuji:
  - token JWT dikirim
  - body valid berisi nama, unit, dan harga
  - id service type hasil create disimpan

  Kenapa penting:
  Service type adalah master data yang dipakai saat membuat order.
headers:
  - key: Content-Type
    value: application/json
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
body:
  type: json
  content: |-
    {
      "name": "Cuci Reguler",
      "weight": "kg",
      "price": 5000
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 201", function () {
        pm.response.to.have.status(201);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message create service type harus benar", function () {
        pm.expect(jsonData.message).to.eql("Service type berhasil dibuat");
      });

      pm.test("data penting service type tidak boleh null", function () {
        pm.expect(jsonData.data.id).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.name).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.weight).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.price).to.not.eql(null);
      });

      pm.environment.set("service_type_id", jsonData.data.id);
""",
    "service types/list-service-types.request.yaml": """$kind: http-request
method: GET
url: '{{base_url}}/api/service-types'
order: 2000
description: |-
  Endpoint ini mengambil daftar service type.

  Yang diuji:
  - endpoint mengembalikan array data
  - field response wrapper konsisten
  - id pertama bisa dipakai untuk request detail/update/delete

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message list service type harus benar", function () {
        pm.expect(jsonData.message).to.eql("Berhasil mengambil data service type");
      });

      pm.test("data harus array", function () {
        pm.expect(jsonData.data).to.be.an("array");
      });

      if (Array.isArray(jsonData.data) && jsonData.data.length > 0) {
        pm.environment.set("service_type_id", jsonData.data[0].id);
      }
""",
    "service types/get-service-type-by-id.request.yaml": """$kind: http-request
method: GET
url: '{{base_url}}/api/service-types/{{service_type_id}}'
order: 3000
description: |-
  Endpoint ini mengambil detail service type berdasarkan id.

  Yang diuji:
  - path variable id terbaca
  - detail master data bisa diambil
  - field penting tidak null

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("data service type tidak boleh null", function () {
        pm.expect(jsonData.data.id).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.name).to.be.a("string").and.not.empty;
      });
""",
    "service types/get-service-type-by-id-not-found.request.yaml": """$kind: http-request
method: GET
url: '{{base_url}}/api/service-types/not-found-id'
order: 6000
description: |-
  Endpoint ini menguji permintaan detail service type dengan id yang tidak ada.

  Yang diuji:
  - backend memberi status not found
  - response error tetap jelas dan mudah dibaca

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 404", function () {
        pm.response.to.have.status(404);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus false", function () {
        pm.expect(jsonData.success).to.eql(false);
      });

      pm.test("message not found harus menjelaskan data tidak ditemukan", function () {
        pm.expect(jsonData.message).to.include("tidak ditemukan");
      });
""",
    "service types/update-service-type.request.yaml": """$kind: http-request
method: PUT
url: '{{base_url}}/api/service-types/{{service_type_id}}'
order: 4000
description: |-
  Endpoint ini mengubah data service type.

  Yang diuji:
  - id service type valid
  - body update valid
  - nilai yang diubah benar-benar kembali di response

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
headers:
  - key: Content-Type
    value: application/json
body:
  type: json
  content: |-
    {
      "name": "Cuci Express",
      "weight": "kg",
      "price": 7000
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message update harus benar", function () {
        pm.expect(jsonData.message).to.eql("Service type berhasil diupdate");
      });

      pm.test("nama service type harus berubah", function () {
        pm.expect(jsonData.data.name).to.eql("Cuci Express");
      });
""",
    "service types/delete-service-type.request.yaml": """$kind: http-request
method: DELETE
url: '{{base_url}}/api/service-types/{{service_type_id}}'
order: 5000
description: |-
  Endpoint ini menghapus service type berdasarkan id.

  Yang diuji:
  - delete berhasil dengan token valid
  - response wrapper tetap benar walau data null

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message delete service type harus benar", function () {
        pm.expect(jsonData.message).to.eql("Service type berhasil dihapus");
      });
""",
    "orders/create-order.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/orders'
order: 1000
description: |-
  Endpoint ini membuat order laundry baru.

  Yang diuji:
  - customerId dan serviceTypeId dikirim
  - order berhasil dibuat
  - id order disimpan untuk test berikutnya

  Kenapa penting:
  Ini adalah proses inti bisnis laundry karena order menjadi sumber status dan total pembayaran.
headers:
  - key: Content-Type
    value: application/json
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
body:
  type: json
  content: |-
    {
      "customerId": "{{customer_id}}",
      "items": [
        {
          "serviceTypeId": "{{service_type_id}}",
          "qty": 2
        }
      ]
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 201", function () {
        pm.response.to.have.status(201);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message create order harus benar", function () {
        pm.expect(jsonData.message).to.eql("Order berhasil dibuat");
      });

      pm.test("field penting order tidak boleh null", function () {
        pm.expect(jsonData.data.id).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.invoiceNumber).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.status).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.totalPrice).to.not.eql(null);
      });

      pm.environment.set("order_id", jsonData.data.id);
""",
    "orders/create-order-invalid-missing-items.request.yaml": """$kind: http-request
method: POST
url: '{{base_url}}/api/orders'
order: 6000
description: |-
  Endpoint ini menguji create order dengan data tidak valid karena items kosong.

  Yang diuji:
  - validasi request body berjalan
  - backend menolak request yang tidak lengkap

headers:
  - key: Content-Type
    value: application/json
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
body:
  type: json
  content: |-
    {
      "customerId": "{{customer_id}}",
      "items": []
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 400", function () {
        pm.response.to.have.status(400);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus false", function () {
        pm.expect(jsonData.success).to.eql(false);
      });

      pm.test("message validasi harus ada", function () {
        pm.expect(jsonData.message).to.include("Validasi gagal");
      });
""",
    "orders/list-orders.request.yaml": """$kind: http-request
method: GET
url: '{{base_url}}/api/orders'
order: 2000
description: |-
  Endpoint ini mengambil daftar order.

  Yang diuji:
  - response data berupa array
  - jika ada data, id pertama disimpan untuk request detail atau update status

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message list order harus benar", function () {
        pm.expect(jsonData.message).to.eql("Berhasil mengambil data order");
      });

      pm.test("data harus array", function () {
        pm.expect(jsonData.data).to.be.an("array");
      });

      if (Array.isArray(jsonData.data) && jsonData.data.length > 0) {
        pm.environment.set("order_id", jsonData.data[0].id);
      }
""",
    "orders/get-order-by-id.request.yaml": """$kind: http-request
method: GET
url: '{{base_url}}/api/orders/{{order_id}}'
order: 3000
description: |-
  Endpoint ini mengambil detail order berdasarkan id.

  Yang diuji:
  - detail order bisa diambil
  - invoice number dan status tidak null

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("field order penting tidak boleh null", function () {
        pm.expect(jsonData.data.id).to.be.a("string").and.not.empty;
        pm.expect(jsonData.data.invoiceNumber).to.be.a("string").and.not.empty;
      });
""",
    "orders/update-order-status.request.yaml": """$kind: http-request
method: PATCH
url: '{{base_url}}/api/orders/{{order_id}}/status'
order: 4000
description: |-
  Endpoint ini mengubah status order.

  Yang diuji:
  - body status dikirim dengan benar
  - status terbaru benar-benar kembali di response

headers:
  - key: Content-Type
    value: application/json
auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
body:
  type: json
  content: |-
    {
      "status": "DIPROSES"
    }
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message update status harus benar", function () {
        pm.expect(jsonData.message).to.eql("Status order berhasil diupdate");
      });

      pm.test("status order harus DIPROSES", function () {
        pm.expect(jsonData.data.status).to.eql("DIPROSES");
      });
""",
    "orders/delete-order.request.yaml": """$kind: http-request
method: DELETE
url: '{{base_url}}/api/orders/{{order_id}}'
order: 5000
description: |-
  Endpoint ini menghapus order berdasarkan id.

  Yang diuji:
  - delete order berhasil
  - response wrapper sukses tetap konsisten

auth:
  type: bearer
  credentials:
    - key: token
      value: '{{jwt_token}}'
post-response:
  - type: text/javascript
    code: |-
      pm.test("Status code harus 200", function () {
        pm.response.to.have.status(200);
      });

      pm.test("Response time harus di bawah 3000 ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(3000);
      });

      pm.test("Content-Type harus JSON", function () {
        pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
      });

      const jsonData = pm.response.json();

      pm.test("success harus true", function () {
        pm.expect(jsonData.success).to.eql(true);
      });

      pm.test("message delete order harus benar", function () {
        pm.expect(jsonData.message).to.eql("Order berhasil dihapus");
      });
""",
}

for rel_path, content in REQUESTS.items():
    path = collection_root / rel_path
    path.write_text(content.replace("\n", "\r\n"), encoding="utf-8")
    print(f"updated {path}")
