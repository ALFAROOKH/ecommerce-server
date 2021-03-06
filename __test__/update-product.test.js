const request = require("supertest")
const app = require("../app")
const models = require('../models')

describe('PUT /products/:id', function () {
  let token
  beforeAll((done) => {
    const body = {
      email: "admin@mail.com",
      password: "1234"
    };

    request(app)
      .post('/users/login')
      .send(body)
      .end(function (err, res) {
        if (err) done(err)
        token = res.body.access_token
        console.log(token)
        done()
      });

  })

  afterAll((done) => {
    models.sequelize.close()
    done()
  })

  it('should send response with status code 200', function (done) {
    const body = {
      name: "kaos aja",
      image_url:
        "https://ecs7.tokopedia.net/img/cache/700/VqbcmM/2020/9/15/a8972d49-c880-43ec-950c-fe2d803643d5.jpg",
      price: 100000,
      stock: 50
    };

    //execute
    request(app)
      .put('/products/27')
      .set('access_token', token)
      .send(body)
      .end(function (err, res) {
        if (err) done(err)

        //assert
        expect(res.statusCode).toEqual(200);
        expect(typeof res.body).toEqual('object');
        expect(res.body.message).toEqual('data updated!');

        done()
      });
  });

  it('should send response with status code 400', function (done) {
    const body = {
      name: "",
      image_url:
        "https://ecs7.tokopedia.net/img/cache/700/VqbcmM/2020/9/15/a8972d49-c880-43ec-950c-fe2d803643d5.jpg",
      price: -1,
      stock: -1
    }
    request(app)
      .put('/products/2')
      .send(body)
      .end(function (err, res) {
        if (err) done(err)

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toEqual(
          expect.arrayContaining(['Name is required', "stock must be more than 0", "Price must be more than 0"])
        );
        done()
      })
  })
});