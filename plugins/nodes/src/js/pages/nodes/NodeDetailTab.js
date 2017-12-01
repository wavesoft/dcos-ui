import { FormattedMessage } from "react-intl";
import PureRender from "react-addons-pure-render-mixin";
import React from "react";

import ConfigurationMap from "#SRC/js/components/ConfigurationMap";
import ConfigurationMapHeading
  from "#SRC/js/components/ConfigurationMapHeading";
import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import DateUtil from "#SRC/js/utils/DateUtil";
import HashMapDisplay from "#SRC/js/components/HashMapDisplay";
import MesosStateStore from "#SRC/js/stores/MesosStateStore";
import Node from "#SRC/js/structs/Node";
import StringUtil from "#SRC/js/utils/StringUtil";
import Units from "#SRC/js/utils/Units";

class NodeDetailTab extends React.Component {
  constructor() {
    super(...arguments);
    this.shouldComponentUpdate = PureRender.shouldComponentUpdate.bind(this);
  }

  render() {
    const { node } = this.props;
    const resources = node.get("resources");

    return (
      <div className="container">
        <ConfigurationMap>
          <ConfigurationMapSection>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage id="Hkq5h2QJZf" defaultMessage={`ID`} />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {node.id}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage id="r1s53nQJ-M" defaultMessage={`Active`} />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {StringUtil.capitalize(node.active.toString().toLowerCase())}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage
                  id="Sknqhn7kWz"
                  defaultMessage={`Registered`}
                />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {DateUtil.msToDateStr(node.registered_time.toFixed(3) * 1000)}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage
                  id="SJpcnhXJZM"
                  defaultMessage={`Master Version`}
                />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {MesosStateStore.get("lastMesosState").version}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
          </ConfigurationMapSection>
          <HashMapDisplay hash={node.attributes} headline="Attributes" />
          <ConfigurationMapSection>
            <ConfigurationMapHeading>
              <FormattedMessage id="SJ05237kWM" defaultMessage={`Resources`} />
            </ConfigurationMapHeading>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage id="rkylq33QkWM" defaultMessage={`Disk`} />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {Units.formatResource("disk", resources.disk)}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage id="Bkleqh2XyWz" defaultMessage={`Mem`} />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {Units.formatResource("mem", resources.mem)}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                <FormattedMessage id="r1Wg92n71bf" defaultMessage={`CPUs`} />
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {Units.formatResource("cpus", resources.cpus)}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
          </ConfigurationMapSection>
        </ConfigurationMap>
      </div>
    );
  }
}

NodeDetailTab.propTypes = {
  node: React.PropTypes.instanceOf(Node).isRequired
};

module.exports = NodeDetailTab;
