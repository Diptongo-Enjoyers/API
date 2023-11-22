import sinon from 'sinon';
import chai from 'chai';
import User from './models/userModel.js';
import Token from './models/tokenModel.js';
import { register } from './controllers/authController.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

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
  