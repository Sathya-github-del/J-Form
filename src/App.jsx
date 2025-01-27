import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Lazy loading components
const Register = lazy(() => import('./components/Register'));
const Login = lazy(() => import('./components/Login'));
const FormSub = lazy(() => import('./components/Formsub'));
const FormFresh = lazy(() => import('./components/Fresher'));
const AdminForm = lazy(() => import('./components/Adminform'));
const AdminAuth = lazy(() => import('./components/Adminauth'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/formsub" element={<FormSub />} />
            <Route path="/formfresh" element={<FormFresh />} />
            <Route path="/adminform" element={<AdminForm />} />
            <Route path="/adminauth" element={<AdminAuth />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
