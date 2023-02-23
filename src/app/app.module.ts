import { SelectionService } from './editor/services/selection.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './test/test.component';
import { EditorComponent } from './editor/editor.component';
import { OneComponent } from './test/one/one.component';
import { TwoComponent } from './test/two/two.component';
import { ThreeComponent } from './test/three/three.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    EditorComponent,
    OneComponent,
    TwoComponent,
    ThreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [SelectionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
