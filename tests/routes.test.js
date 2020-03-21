const request = require('supertest');
const app = require('../index');

it('should update user', async () => {
    let result = await request(app)
        .post('/updateUser')
        .send(
            {
                "firstName": "Miranda",
                "lastName": "Lawson",
                "email": "mlawson@cerbcorps.com",
                "budget": "10.00",
            }
        )
    expect(result.statusCode).toBe(302);
});
