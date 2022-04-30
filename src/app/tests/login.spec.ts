import {  inject, TestBed } from '@angular/core/testing';
import { LoginService } from '../services/login.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { Overlay } from '@angular/cdk/overlay';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { PresenceService } from '../services/presence.service';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginComponent } from '../views/login/login.component';

describe( 'Login Incorrect and Correctly and Logout User', () =>{

    beforeEach( async() =>{
        await TestBed.configureTestingModule({
            providers:[
                Overlay,
                AngularFireAuth,
                PresenceService,
            ],
            imports:[
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([
                    {path: 'login', component: LoginComponent}
                ]),
                AngularFireModule.initializeApp(environment.firebaseConfig),
                provideAuth( () => getAuth()),
            ]
        })
    })

    it('Login with incorrect info should fail', inject([LoginService], async (_login: LoginService) =>{
        let response = await _login.loginUser('yathartha.floyd@gmail.com', 'wrongpassword123');
        expect(response).toBeFalse();
    }))

    it('Login with correct info should succeed', inject([LoginService], async (_login: LoginService) =>{
        let response = await _login.loginUser('yathartha.floyd@gmail.com', 'hardyman96');
        expect(response).toBeTrue();
    }))

    it('Logout user will return to login screen', inject([LoginService, Router, AngularFireAuth ], async (_login: LoginService, _router: Router, _auth: AngularFireAuth) =>{
        await _login.loginUser('yathartha.floyd@gmail.com', 'hardyman96');
        await _auth.currentUser;
        await _login.logoutUser()
        expect(_router.url).toEqual('/login');
        
        
    }))
})