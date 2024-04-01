import React from "react";
import "../css/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div>
        &copy; {new Date().getFullYear()} HealthApp. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
