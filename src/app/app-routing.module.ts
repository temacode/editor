import { ThreeComponent } from './test/three/three.component';
import { TwoComponent } from './test/two/two.component';
import { OneComponent } from './test/one/one.component';
import { EditorComponent } from './editor/editor.component';
import { TestComponent } from './test/test.component';
import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'editor',
        component: EditorComponent
      },
      {
        path: 'test',
        component: TestComponent,
        children: [
          { path: 'one', component: OneComponent },
          { path: 'two', component: TwoComponent },
          { path: 'three', component: ThreeComponent },
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
