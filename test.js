import sinon from 'sinon';
import chai from 'chai';
import User from './models/userModel.js';
import Token from './models/tokenModel.js';
import { register,
        login,
        logout,
        registerWorker } from './controllers/authController.js';
import AppError from './utils/AppError.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const expect = chai.expect;

describe('Función Register', () => {
    let resMock, reqMock, nextFunctionMock, userFindOneStub, userSaveStub, tokenSaveStub, nodemailerStub;
  
    beforeEach(() => {
      // Crear mocks y stubs aquí
      resMock = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      reqMock = { body: {} }; // Ajusta según lo que necesites
      nextFunctionMock = sinon.stub();
  
      // Stub de User.findOne
      userFindOneStub = sinon.stub(User, 'findOne');
      // Stub de User.save
      userSaveStub = sinon.stub(User.prototype, 'save');
      // Stub de Token.save
      tokenSaveStub = sinon.stub(Token.prototype, 'save');
        // Stub de bcrypt.hash
        sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      // Stub de nodemailer
      nodemailerStub = sinon.stub(nodemailer, 'createTransport').returns({
        sendMail: sinon.stub().yields(null, true)
      });
    });
  
    afterEach(() => {
      // Restaurar los stubs y mocks
      sinon.restore();
    });
  
    it('debería fallar si el correo electrónico ya está registrado', async () => {
      reqMock.body = { email: 'test@example.com', password: 'password123' };
      userFindOneStub.resolves(true); // Simular un usuario existente
  
      await register(reqMock, resMock, nextFunctionMock);
  
      sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(Error));
      sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 400));
    });
  
    it('debería fallar si el nombre de usuario ya está registrado', async () => {
        reqMock.body = { email: 'new@example.com', username: 'existingUser', password: 'password123' };
        userFindOneStub.onFirstCall().resolves(null); // No existe un usuario con ese email
        userFindOneStub.onSecondCall().resolves(true); // Existe un usuario con ese username
      
        await register(reqMock, resMock, nextFunctionMock);
      
        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(Error));
        sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 400));
      });
      
      it('debería fallar si se intenta registrar con un rol prohibido', async () => {
        reqMock.body = { email: 'new@example.com', username: 'newUser', password: 'password123', clearance: 1 };
        userFindOneStub.resolves(null); // No existe un usuario con ese email o username
      
        await register(reqMock, resMock, nextFunctionMock);
      
        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(Error));
        sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 400));
      });
      
      it('debería registrar un usuario correctamente', async () => {
        reqMock.body = { email: 'new@example.com', username: 'newUser', password: 'password123' };
        userFindOneStub.resolves(null); // No existe un usuario con ese email o username
        userSaveStub.resolves({ _id: 'userId', email: 'new@example.com', username: 'newUser' }); // Simula guardado exitoso
      
        await register(reqMock, resMock, nextFunctionMock);

        sinon.assert.calledWith(resMock.status, 201);
        sinon.assert.calledWith(resMock.json, sinon.match.has('accessToken'));
      });
      
      it('debería manejar errores al guardar el usuario', async () => {
        reqMock.body = { email: 'new@example.com', username: 'newUser', password: 'password123' };
        userFindOneStub.resolves(null); // No existe un usuario con ese email o username
        userSaveStub.rejects(new Error('Error al guardar')); // Simula un error al guardar
      
        await register(reqMock, resMock, nextFunctionMock);
      
        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(Error));
      }); 
});
describe('Función Login', () => {
    let resMock, reqMock, nextFunctionMock, userFindOneStub, bcryptCompareStub, jwtSignStub, tokenSaveStub;

    beforeEach(() => {
        resMock = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        reqMock = { body: {} };
        nextFunctionMock = sinon.stub();

        userFindOneStub = sinon.stub(User, 'findOne');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
        jwtSignStub = sinon.stub(jwt, 'sign');
        tokenSaveStub = sinon.stub(Token.prototype, 'save');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debería fallar si el usuario no existe', async () => {
        reqMock.body = { email: 'inexistente@example.com', password: 'password123' };
        userFindOneStub.resolves(null);

        await login(reqMock, resMock, nextFunctionMock);

        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(Error));
        sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 401));
    });

    it('debería fallar si la contraseña es incorrecta', async () => {
        reqMock.body = { email: 'usuario@example.com', password: 'incorrecta' };
        userFindOneStub.resolves({ email: 'usuario@example.com', password: 'hashedPassword' });
        bcryptCompareStub.resolves(false);

        await login(reqMock, resMock, nextFunctionMock);

        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(Error));
        sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 401));
    });

    it('debería iniciar sesión correctamente', async () => {
        reqMock.body = { email: 'usuario@example.com', password: 'correcta' };
        userFindOneStub.resolves({ _id: 'userId', email: 'usuario@example.com', password: 'hashedPassword' });
        bcryptCompareStub.resolves(true);
        jwtSignStub.returns('accessToken');
        tokenSaveStub.resolves();
        
        await login(reqMock, resMock, nextFunctionMock);
        
        sinon.assert.calledWith(resMock.status, 200);
        sinon.assert.calledWith(resMock.json, sinon.match.has('accessToken'));
        });
    });
    describe('Función Logout', () => {
    let resMock, reqMock, nextFunctionMock, userFindByIdStub, tokenFindOneStub, tokenDeleteOneStub;

    beforeEach(() => {
        resMock = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        reqMock = { user: { _id: 'userId', username: 'userTest' } };
        nextFunctionMock = sinon.stub();

        userFindByIdStub = sinon.stub(User, 'findById');
        tokenFindOneStub = sinon.stub(Token, 'findOne');
        tokenDeleteOneStub = sinon.stub(Token.prototype, 'deleteOne');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('debería fallar si el usuario no se encuentra', async () => {
        userFindByIdStub.resolves(null);

        await logout(reqMock, resMock, nextFunctionMock);

        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(AppError));
        sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 404));
    });

    it('debería fallar si el token no se encuentra', async () => {
        userFindByIdStub.resolves({ _id: 'userId', username: 'userTest' });
        tokenFindOneStub.resolves(null);

        await logout(reqMock, resMock, nextFunctionMock);

        sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(AppError));
        sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 404));
    });

    it('debería realizar el logout exitosamente', async () => {
        userFindByIdStub.resolves({ _id: 'userId', username: 'userTest' });
        tokenFindOneStub.resolves({ userId: 'userId', deleteOne: sinon.stub().resolves() });

        await logout(reqMock, resMock, nextFunctionMock);

        sinon.assert.calledWith(resMock.status, 200);
        sinon.assert.calledWith(resMock.json, sinon.match.has('message', 'Logout exitoso'));
    });
});

describe('Función RegisterWorker', () => {
    let resMock, reqMock, nextFunctionMock, userFindOneStub, userSaveStub, bcryptHashStub, jwtSignStub;
  
    beforeEach(() => {
      resMock = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      reqMock = { user: {}, body: {} };
      nextFunctionMock = sinon.stub();
  
      userFindOneStub = sinon.stub(User, 'findOne');
      userSaveStub = sinon.stub(User.prototype, 'save');
      bcryptHashStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      jwtSignStub = sinon.stub(jwt, 'sign').returns('accessToken');
    });
  
    afterEach(() => {
      sinon.restore();
    });
  
    it('debería fallar si el usuario que realiza la petición no tiene permiso', async () => {
      reqMock.user.clearance = 1;
  
      await registerWorker(reqMock, resMock, nextFunctionMock);
  
      sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(AppError));
      sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 403));
    });
  
    it('debería fallar si el correo electrónico ya está registrado', async () => {
      reqMock.user.clearance = 1;
      reqMock.body.email = 'existing@example.com';
      userFindOneStub.resolves(true);
  
      await registerWorker(reqMock, resMock, nextFunctionMock);
  
      sinon.assert.calledWith(nextFunctionMock, sinon.match.instanceOf(AppError));
      sinon.assert.calledWith(nextFunctionMock, sinon.match.has('status', 403));
    });
  
    it('debería registrar un trabajador correctamente', async () => {
        reqMock.user.clearance = 0;
        reqMock.body = { email: 'new@example.com', password: 'password123', username: 'newUser' };
        userFindOneStub.onCall(0).resolves(null);
        userFindOneStub.onCall(1).resolves(null);
      
        await registerWorker(reqMock, resMock, nextFunctionMock);
      

        sinon.assert.calledWith(resMock.status, 201);
        sinon.assert.calledWith(resMock.json, sinon.match.has('accessToken'));
      });
      
  });
  