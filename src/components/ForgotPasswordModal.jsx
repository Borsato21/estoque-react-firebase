import {useState} from 'react';
import {resetPassword} from '../services/auth';
import Dialog from './Dialog';
export default function ForgotPasswordModal({onClose}) {
 const [email,setEmail]=useState('');const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [sent,setSent]=useState(false);
 async function send(event){event.preventDefault();setLoading(true);setError('');try{await resetPassword(email);setSent(true);}catch{setError('Não foi possível enviar o link. Confira o email e tente novamente.');}finally{setLoading(false);}}
 return <Dialog title="Recuperar senha" onClose={onClose}>{sent ? <div className="recovery-sent"><p>Se houver uma conta com esse email, você receberá um link para definir uma nova senha.</p><button className="primary-button" onClick={onClose}>Entendi</button></div> : <form className="form-stack" onSubmit={send}><p className="form-description">Informe o email da sua conta para receber um link de recuperação.</p><label>Email<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>{error&&<p className="inline-error" role="alert">{error}</p>}<footer className="dialog-actions"><button type="button" onClick={onClose}>Cancelar</button><button className="primary-button" disabled={loading}>{loading?'Enviando...':'Enviar link'}</button></footer></form>}</Dialog>;
}
