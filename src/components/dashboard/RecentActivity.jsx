import React, { useContext } from "react";
// Import the LeadContext to access real-time activity tracking lists
import { LeadContext } from "../../context/LeadContext";
// Import icons to visually label different activity actions
import { UserPlus, ToggleLeft, Trash2, ShieldAlert } from "lucide-react";

/**
 * RecentActivity renders a visual timeline tracking recent modifications
 * made to leads inside the CRM.
 */
function RecentActivity() {
  // Extract activities array list from the LeadContext
  const { activities } = useContext(LeadContext);

  /**
   * Helper function to return visual indicator styles and Lucide icons
   * matching specific action types.
   */
  const getActivityStyles = (type) => {
    switch (type) {
      // Creation actions get standard green layouts
      case "create":
        return {
          icon: UserPlus,
          colorClass: "text-success bg-success/10",
        };
      // Status update actions get standard blue layouts
      case "status_change":
        return {
          icon: ToggleLeft,
          colorClass: "text-blue-600 bg-blue-50",
        };
      // Deletion actions get standard danger red layouts
      case "delete":
        return {
          icon: Trash2,
          colorClass: "text-danger bg-danger/10",
        };
      // Fallback settings
      default:
        return {
          icon: ShieldAlert,
          colorClass: "text-slate-500 bg-slate-50",
        };
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex-1">
      {/* Header Panel */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-text-dark">Recent Activity</h2>
        <p className="text-xs text-text-gray mt-1">
          Chronological audit timeline of updates in the CRM workspace
        </p>
      </div>

      {/* Main timeline listing */}
      {activities.length === 0 ? (
        // Empty state fallback display
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-text-gray font-medium">No recent activity logged</p>
        </div>
      ) : (
        // Display list of activity timeline rows
        <div className="relative border-l border-slate-100 ml-4.5 pl-6 space-y-6">
          {activities.slice(0, 5).map((act) => {
            // Retrieve layout parameters matching current activity type
            const { icon: IconComponent, colorClass } = getActivityStyles(act.type);

            return (
              <div key={act.id} className="relative">
                {/* Timeline dot icon overlayed exactly on the left hand border */}
                <div
                  className={`absolute -left-[38px] top-0.5 p-1.5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${colorClass}`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>

                {/* Timeline text contents */}
                <div>
                  <p className="text-sm text-text-dark font-medium leading-relaxed">
                    <span className="font-bold text-slate-800 mr-1">{act.leadName}</span>
                    <span className="text-text-gray">{act.action}</span>
                  </p>
                  {/* Timestamp label */}
                  <span className="text-xs text-text-gray mt-1 block">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
