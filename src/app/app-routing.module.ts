import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'mood',
    loadChildren: () => import('./pages/mood/mood.module').then( m => m.MoodPageModule)
  },
  {
    path: 'impostazioni',
    loadChildren: () => import('./pages/impostazioni/impostazioni.module').then( m => m.ImpostazioniPageModule)
  },
  {
    path: 'medico',
    loadChildren: () => import('./pages/medico/medico.module').then( m => m.MedicoPageModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./pages/aboutus/aboutus.module').then( m => m.AboutusPageModule)
  },
  {
    path: 'pills',
    loadChildren: () => import('./pages/pills/pills.module').then( m => m.PillsPageModule)
  },
  {
    path: 'diario',
    loadChildren: () => import('./pages/diario/diario.module').then( m => m.DiarioPageModule)
  },
  {
    path: 'updates',
    loadChildren: () => import('./pages/updates/updates.module').then( m => m.UpdatesPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'salute',
    loadChildren: () => import('./pages/salute/salute.module').then( m => m.SalutePageModule)
  },
  {
    path: 'obiettivi',
    loadChildren: () => import('./pages/obiettivi/obiettivi.module').then( m => m.ObiettiviPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pages/privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'comportamenti',
    loadChildren: () => import('./pages/comportamenti/comportamenti.module').then( m => m.ComportamentiPageModule)
  },
  {
    path: 'emozioni',
    loadChildren: () => import('./pages/emozioni/emozioni.module').then( m => m.EmozioniPageModule)
  },
  {
    path: 'tests',
    loadChildren: () => import('./pages/tests/tests.module').then( m => m.TestsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
