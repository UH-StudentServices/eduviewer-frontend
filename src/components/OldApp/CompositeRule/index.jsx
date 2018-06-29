import React, { Component } from 'react';
import { shape, string, node } from 'prop-types';

import CourseList from '../CourseList/index';
import Dropdown from '../Dropdown/index'; // eslint-disable-line
import ElementList from '../ElementList/index'; // eslint-disable-line

import { isNotEmpty, isViewAllEnabled, parseRuleData } from '../utils/index';

export default class CompositeRule extends Component {
  createMarkUp = rule => ({ __html: rule.description.fi });

  renderModules = (rule, rulesData) => {
    const { elem, lv } = this.props;
    const name = elem.name.fi.toLowerCase();
    const dropDownTime = (name === 'opintosuunta'
      || name === 'stuydy track')
      || (name === 'vieras kieli'
      || name === 'foreign language');

    return (
      <div>
        { !isViewAllEnabled() && dropDownTime
        && (
          <li>
            <Dropdown
              key={`dd-${rule.localId}`}
              rule={rule}
              id={`dd-${rule.localId}`}
              ids={rulesData.modules}
              lv={lv}
            />
          </li>
        )
        }
        { !isViewAllEnabled() && !dropDownTime
        && (
          <ElementList
            key={`mods-${rule.localId}`}
            id={`mods-${rule.localId}`}
            ids={rulesData.modules}
            lv={lv}
            rule={rule}
          />
        )
        }
        { (isViewAllEnabled() || rule.require == null)
        && (
          <ElementList
            key={`mods-${rule.localId}`}
            id={`mods-${rule.localId}`}
            ids={rulesData.modules}
            lv={lv}
            rule={rule}
          />
        )
        }
      </div>
    );
  };

  renderCourses(rule, rulesData) {
    const { lv } = this.props;
    return <CourseList key={`cu-${rule.id}`} ids={rulesData.courses} lv={lv} />;
  }

  render() {
    const { rule, children } = this.props;
    const rulesData = parseRuleData(rule);

    if (rulesData.anyMR != null) {
      console.log('anyrule was true');
      console.log(rulesData);
    }

    console.log(`${rule.localId}: desc: ${rule.description}`);
    return (
      <div>
        {rule.description != null && isNotEmpty(rule.description.fi)
        && (
          <li>
            <i>
              <div dangerouslySetInnerHTML={this.createMarkUp(rule)} />
            </i>
          </li>
        )
        }
        {rulesData.courses.length > 0 && this.renderCourses(rule, rulesData)}
        {rulesData.modules.length > 0 && this.renderModules(rule, rulesData)}
        {children}
      </div>
    );
  }
}

CompositeRule.propTypes = {
  lv: string.isRequired,
  children: node.isRequired,
  rule: shape({
    name: string.isRequired
  }).isRequired,
  elem: shape({}).isRequired
};
