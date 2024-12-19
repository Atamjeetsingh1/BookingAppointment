import React, { useState } from "react";
import { Collapse, Badge } from "reactstrap";
import classnames from "classnames";

const RctCollapsibleCard = ({
  children,
  collapsible,
  closeable,
  reloadable,
  heading,
  fullBlock,
  colClasses,
  customClasses,
  headingCustomClasses,
  contentCustomClasses,
  badge,
}) => {
  const [reload, setReload] = useState(false);
  const [collapse, setCollapse] = useState(true);
  const [close, setClose] = useState(false);

  const onCollapse = (e) => {
    e.preventDefault();
    setCollapse(!collapse);
  };

  const onReload = (e) => {
    e.preventDefault();
    setReload(true);
    setTimeout(() => {
      setReload(false);
    }, 1500);
  };

  const onCloseSection = (e) => {
    e.preventDefault();
    setClose(true);
  };

  return (
    <div
      className={classnames(colClasses ? colClasses : "", {
        "d-block": !collapse,
      })}
    >
      <div
        className={classnames(
          `rct-block ${customClasses ? customClasses : ""}`,
          { "d-none": close }
        )}
      >
        {heading && (
          <div
            className={`rct-block-title ${
              headingCustomClasses ? headingCustomClasses : ""
            }`}
          >
            <h4>
              {heading}{" "}
              {badge && (
                <Badge className="p-1 ml-10" color={badge.class}>
                  {badge.name}
                </Badge>
              )}
            </h4>
            {(collapsible || reloadable || closeable) && (
              <div className="contextual-link">
                {collapsible && (
                  <a href="#" onClick={onCollapse}>
                    <i className="ti-minus"></i>
                  </a>
                )}
                {reloadable && (
                  <a href="#" onClick={onReload}>
                    <i className="ti-reload"></i>
                  </a>
                )}
                {closeable && (
                  <a href="#" onClick={onCloseSection}>
                    <i className="delete_new zmdi zmdi-delete"></i>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
        <Collapse isOpen={collapse}>
          <div
            className={classnames(
              contentCustomClasses ? contentCustomClasses : "",
              { "rct-block-content": !fullBlock, "rct-full-block": fullBlock }
            )}
          >
            {children}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default RctCollapsibleCard;
