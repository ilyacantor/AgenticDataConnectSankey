function FinOpsAgentDashboard({ visible = false, showHubSpot = false, totalRevenue = '245M' }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-slate-900 flex items-center justify-center p-8">
      <div className="bg-slate-800 rounded-lg p-8 max-w-4xl w-full border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">FinOps Agent Dashboard</h2>
          <div className="text-right">
            <div className="text-sm text-slate-400">Total Revenue Forecast</div>
            <div className="text-3xl font-bold text-green-400">${totalRevenue}</div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Forecast by Source</h3>
          <div className="flex items-end gap-8 h-[300px]">
            {/* Salesforce Bar */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-blue-500 rounded-t-lg transition-all duration-500" style={{ height: '180px' }}>
                <div className="h-full flex items-center justify-center text-white font-semibold">$98M</div>
              </div>
              <div className="text-slate-300 font-medium">Salesforce</div>
            </div>
            
            {/* Dynamics Bar */}
            <div className="flex-1 flex flex-col items-center gap-3">
              <div className="w-full bg-purple-500 rounded-t-lg transition-all duration-500" style={{ height: '120px' }}>
                <div className="h-full flex items-center justify-center text-white font-semibold">$67M</div>
              </div>
              <div className="text-slate-300 font-medium">Dynamics</div>
            </div>
            
            {/* HubSpot Bar - animated */}
            {showHubSpot && (
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-green-500 rounded-t-lg animate-grow-height" style={{ height: '150px' }}>
                  <div className="h-full flex items-center justify-center text-white font-semibold">$80M</div>
                </div>
                <div className="text-slate-300 font-medium">HubSpot</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
