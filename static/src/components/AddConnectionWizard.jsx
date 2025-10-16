function AddConnectionWizard({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = React.useState(1);
  const [connectionName, setConnectionName] = React.useState('');
  const [formData, setFormData] = React.useState({
    host: '',
    port: 5432,
    database_name: '',
    db_user: '',
    password: ''
  });
  const [testStatus, setTestStatus] = React.useState(null);
  const [testMessage, setTestMessage] = React.useState('');
  const [isTesting, setIsTesting] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleNext = () => {
    if (step === 1 && connectionName.trim()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setTestStatus(null);
    setTestMessage('');
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestStatus(null);
    setTestMessage('');

    try {
      const response = await fetch('/api/connections/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTestStatus('success');
        setTestMessage(data.message || 'Connection successful!');
      } else {
        setTestStatus('error');
        setTestMessage(data.message || 'Connection failed. Please check your credentials.');
      }
    } catch (error) {
      setTestStatus('error');
      setTestMessage('Network error. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch('/api/connections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connection_name: connectionName,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        handleClose();
      } else {
        setTestStatus('error');
        setTestMessage(data.message || 'Failed to save connection.');
      }
    } catch (error) {
      setTestStatus('error');
      setTestMessage('Failed to save connection. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setConnectionName('');
    setFormData({ host: '', port: 5432, database_name: '', db_user: '', password: '' });
    setTestStatus(null);
    setTestMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Add New PostgreSQL Connection</h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Connection Name
                </label>
                <input
                  type="text"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  placeholder="e.g., Production Database"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNext}
                  disabled={!connectionName.trim()}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Host
                  </label>
                  <input
                    type="text"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    placeholder="localhost or IP address"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) || 5432 })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Database Name
                  </label>
                  <input
                    type="text"
                    value={formData.database_name}
                    onChange={(e) => setFormData({ ...formData, database_name: e.target.value })}
                    placeholder="database_name"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    User
                  </label>
                  <input
                    type="text"
                    value={formData.db_user}
                    onChange={(e) => setFormData({ ...formData, db_user: e.target.value })}
                    placeholder="username"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {testStatus && (
                <div className={`p-4 rounded-lg border ${
                  testStatus === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  {testMessage}
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Back
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleTestConnection}
                    disabled={isTesting || !formData.host || !formData.database_name || !formData.db_user}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isTesting && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    Test Connection
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving || testStatus !== 'success'}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving && (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                    Save Connection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
