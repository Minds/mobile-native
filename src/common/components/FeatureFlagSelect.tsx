//@ts-nocheck
import React, { Component } from 'react';
import featuresService from '../services/features.service';
import { observer } from 'mobx-react';

/**
 * Feature Flag Select Component
 * @param {Component} Wrapped
 * @param {Component} Fallback
 * @param {string} flag
 */
export default (Wrapped, Fallback, flag) => {
  @observer
  class FeatureFlagSelect extends Component {
    /**
     * Render
     */
    render() {
      // only show after the features are loaded
      if (!featuresService.loaded) return null;

      if (featuresService.has(flag)) {
        return <Wrapped {...this.props} />;
      } else {
        return <Fallback {...this.props} />;
      }
    }
  }

  return FeatureFlagSelect;
};
