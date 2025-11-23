import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const BillingComponent: React.FC = () => {
  return (
    <div className="p-4">
      <h4 className="text-primary mb-4">Billing & Subscription</h4>

      {/* Info Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body text-center">
          <h5 className="mb-2">All Services Are Currently Free!</h5>
          <p className="text-muted mb-0">
            Enjoy all our features for now without any charges. We value your feedback — let us know your thoughts at{" "}
            <a href="mailto:rahudnainggolan@gmail.com" className="text-primary">
              rahudnainggolan@gmail.com
            </a>
            .
          </p>
        </div>
      </div>

      {/* Optional: Recent Transactions placeholder */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light">
          <h6 className="mb-0">Recent Transactions</h6>
        </div>
        <div className="card-body text-center p-4">
          <p className="text-muted mb-0">No transactions yet — all services are free!</p>
        </div>
      </div>
    </div>
  );
};

export default BillingComponent;
