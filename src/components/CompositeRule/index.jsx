/* eslint-disable */

import React from 'react';

import CourseList from '../CourseList';
import Dropdown from '../Dropdown';
import ElementList from '../ElementList';
import Rule from '../Rule';

import { isNotEmpty, isViewAllEnabled, parseRuleData } from '../../utils';

export default class CompositeRule extends React.Component {
  constructor(props) {
    super(props);
    this.createMarkUp = this.createMarkUp.bind(this);
    this.renderModules = this.renderModules.bind(this);
  }

  isModules(array) {
    return array.length == 0 || array[0].type == 'ModuleRule';
  }

  createMarkUp(rule) {
    return { __html: rule.description.fi };
  }

  renderModules(rule, rulesData) {
    const name = this.props.elem.name.fi.toLowerCase();
    const dropDownTime = (name == 'opintosuunta' || name == 'stuydy track') || (name == 'vieras kieli' || name == 'foreign language');
    return (
      <div>
        { !isViewAllEnabled() && dropDownTime
        && (
          <li>
            <Dropdown key={`dd-${rule.localId}`} rule={rule} id={`dd-${rule.localId}`} ids={rulesData.modules} lv={this.props.lv} />
          </li>
        )
        }
        { !isViewAllEnabled() && !dropDownTime
        && (
          <ElementList
            key={`mods-${rule.localId}`}
            id={`mods-${rule.localId}`}
            ids={rulesData.modules}
            lv={this.props.lv}
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
            lv={this.props.lv}
            rule={rule}
          />
        )
        }
      </div>
    );
  }

  renderCourses(rule, rulesData) {
    return (
      <CourseList key={`cu-${rule.id}`} ids={rulesData.courses} lv={this.props.lv} />
    );
  }

  render() {
    const rule = this.props.rule;
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
              <div name="description" dangerouslySetInnerHTML={this.createMarkUp(rule)} />
            </i>
          </li>
        )
        }
        {rulesData.courses.length > 0 && this.renderCourses(rule, rulesData)}
        {rulesData.modules.length > 0 && this.renderModules(rule, rulesData)}
        {rulesData.anyMR != null && <Rule key={rulesData.anyMR.localId} rule={rulesData.anyMR} lv={this.props.lv} elem={this.props.elem} />}
        {rulesData.anyCUR != null && <Rule key={rulesData.anyCUR.localId} rule={rulesData.anyCUR} lv={this.props.lv} elem={this.props.elem} />}
        {rulesData.creditsRules.length > 0 && <Rule key={rulesData.creditsRules[0].localId} rule={rulesData.creditsRules[0]} lv={this.props.lv} elem={this.props.elem} />}
      </div>
    );
  }
}
