import Icon from './Icon';

export default function PageHeader({ title, description, action, onAction }) {
  return <header className="page-header"><div><h1>{title}</h1><p>{description}</p></div>
    {action && <button className="primary-button" onClick={onAction}><Icon name="plus" />{action}</button>}
  </header>;
}
