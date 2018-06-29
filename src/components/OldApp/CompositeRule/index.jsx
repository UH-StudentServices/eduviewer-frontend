import React, { Component } from 'react';
import { string, node } from 'prop-types';

import CourseList from '../CourseList/index';
import Dropdown from '../Dropdown/index'; // eslint-disable-line
import ElementList from '../ElementList/index'; // eslint-disable-line

import { isNotEmpty, isViewAllEnabled, parseRuleData } from '../utils/index';
import { elemType, ruleType } from '../../../types/index';

export default class CompositeRule extends Component {
  createMarkUp = rule => ({ __html: rule.description.fi });

  shouldRenderDropdown() {
    const { elem } = this.props;
    const name = elem.name.fi.toLowerCase();
    return ['opintosuunta', 'study track', 'vieras kieli', 'foreign language'].includes(name);
  }

  renderModules = (rule, rulesData) => {
    const { academicYear } = this.props;
    const shouldRenderDropdown = this.shouldRenderDropdown();

    return (
      <div>
        { !isViewAllEnabled() && shouldRenderDropdown
        && (
          <li>
            <Dropdown
              key={`dd-${rule.localId}`}
              rule={rule}
              id={`dd-${rule.localId}`}
              ids={rulesData.modules}
              lv={academicYear}
            />
          </li>
        )
        }
        { !isViewAllEnabled() && !shouldRenderDropdown
        && (
          <ElementList
            key={`mods-${rule.localId}`}
            id={`mods-${rule.localId}`}
            ids={rulesData.modules}
            lv={academicYear}
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
            lv={academicYear}
            rule={rule}
          />
        )
        }
      </div>
    );
  };

  renderCourses(rule, rulesData) {
    const { academicYear } = this.props;
    return <CourseList key={`cu-${rule.id}`} ids={rulesData.courses} lv={academicYear} />;
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
  academicYear: string.isRequired,
  children: node.isRequired,
  rule: ruleType.isRequired,
  elem: elemType.isRequired
};
