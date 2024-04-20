import React,{useEffect} from "react";
import BarGraph from "./BarGraph.jsx";

const Analytics = ({ analytics, port }) => {
  useEffect(() => {
    const getAnalytics = {
      id: 34,
    };
    port.postMessage(getAnalytics);
  }, []);
  return (
    <div className="tabify w-full grid grid-cols-5 h-[60vh] overflow-y-auto">
      {analytics.map((tab) => {
        return <BarGraph tab={tab} />;
      })}
    </div>
  );
};

export default Analytics;
