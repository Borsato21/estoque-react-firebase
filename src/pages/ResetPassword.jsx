import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {supabase} from '../services/supabaseClient';
export default function ResetPassword(){
 const [password,setPassword]=useState('');const [confirmation,setConfirmation]=useState('');const [message,setMessage]=useState('');const [loading,setLoading]=useState(false);const navigate=useNavigate();
 async function save(event){event.preventDefault();if(password!==confirmation){setMessage('As senhas precisam ser iguais.');return;}setLoading(true);setMessage('');try{const{error}=await supabase.auth.updateUser({password});if(error)throw error;navigate('/estoque',{replace:true});}catch(error){setMessage(error.message);}finally{setLoading(false);}}
 return <main className="login-container"><section className="login-card"><h1>Redefinir senha</h1><p>Abra o link recebido por email e escolha uma nova senha para sua conta.</p><form className="form-stack" onSubmit={save}><label>Nova senha<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} aria-describedby="password-help"/></label><p className="field-help" id="password-help">Use pelo menos 8 caracteres.</p><label>Confirme a nova senha<input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label>{message&&<p role="alert" className="inline-error">{message}</p>}<button className="primary-button" disabled={loading}>{loading?'Salvando...':'Salvar nova senha'}</button></form></section></main>;
}
