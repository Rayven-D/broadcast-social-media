import { HttpClientTestingModule } from "@angular/common/http/testing"
import { ComponentFixture, inject, TestBed } from "@angular/core/testing"
import { getAuth, provideAuth } from "@angular/fire/auth"
import { AngularFireModule } from "@angular/fire/compat"
import { AngularFireAuth } from "@angular/fire/compat/auth"
import { AngularFireAuthGuard } from "@angular/fire/compat/auth-guard"
import { MatMenu, MatMenuModule } from "@angular/material/menu"
import { Router } from "@angular/router"
import { RouterTestingModule } from "@angular/router/testing"
import { environment } from "src/environments/environment"
import { UserAccounts } from "../models/user"
import { LoginService } from "../services/login.service"
import { NavbarComponent } from "../shared/navbar/navbar.component"
import { ProfileComponent } from "../views/profile/profile.component"

describe( 'Navigate to current user profile page', () =>{
    let fixture: ComponentFixture<NavbarComponent>;
    let component: NavbarComponent;
    const account: UserAccounts = {
        accountName: 'user05',
        dob: '04-25-2022',
        email: 'yathartha.regmi@gmail.com',
        firstName: "Yathartha",
        lastName: "Regmi",
        userId: 'QFoNMUhAKmMAZHXgAMRVOsRaZ4t2',
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/broadcast-seniorcapstone.appspot.com/o/default.jpeg?alt=media&token=1996ce6b-dee6-4cd4-b743-5ee4fe9b1a4c'
    }

    jasmine.getEnv().configure({random: false})

    beforeEach( async () =>{
        await TestBed.configureTestingModule({
            declarations:[
                NavbarComponent,
                ProfileComponent,
            ],
            imports:[
                RouterTestingModule.withRoutes([
                    {path: 'profile/:accountName', component: ProfileComponent,
                        children:[
                        { path: ':accountName', component: ProfileComponent}
                    ]}
                ]),
                AngularFireModule.initializeApp(environment.firebaseConfig),
                provideAuth( () => getAuth()),
                HttpClientTestingModule,
                MatMenuModule
                
            ]
        })
    })

    beforeEach( () =>{
        fixture = TestBed.createComponent(NavbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('View Profile should navigate to User\'s own profile', inject([Router], async(_router: Router) =>{

        component.currentUser = account;
        component.navigateToProfile();
        await fixture.whenStable();

        expect(_router.routerState.snapshot.url).toEqual(`/profile/${account.accountName}`)

    }))
})