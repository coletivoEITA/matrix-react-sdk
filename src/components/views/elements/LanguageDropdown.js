/*
Copyright 2017 Vector Creations Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React from 'react';

import sdk from '../../../index';

const LANGUAGES = [
    {
        id: 'language',
        label: 'German',
        value: 'de_DE',
    },
    {
        id: 'language',
        label: 'English',
        value: 'en_EN',
    }
];

const LANGUAGES_BY_ID = new Object(null);
for (const l of LANGUAGES) {
    LANGUAGES_BY_ID[l.id] = l;
}

function languageMatchesSearchQuery(query, language) {
    if (language.label.toUpperCase().indexOf(query.toUpperCase()) == 0) return true;
    if (language.id.toUpperCase() == query.toUpperCase()) return true;
    if (language.value.toUpperCase() == query.toUpperCase()) return true;
    return false;
}

const MAX_DISPLAYED_ROWS = 3;

export default class LanguageDropdown extends React.Component {
    constructor(props) {
        super(props);
        this._onSearchChange = this._onSearchChange.bind(this);

        this.state = {
            searchQuery: '',
        }

        if (!props.value) {
            // If no value is given, we start with the first
            // country selected, but our parent component
            // doesn't know this, therefore we do this.
            const language = navigator.language || navigator.userLanguage;
            this.props.onOptionChange(language);
        }
    }

    _onSearchChange(search) {
        this.setState({
            searchQuery: search,
        });
    }

    render() {
        const Dropdown = sdk.getComponent('elements.Dropdown');

        let displayedLanguages;
        if (this.state.searchQuery) {
            displayedLanguages = LANGUAGES.filter(
                languageMatchesSearchQuery.bind(this, this.state.searchQuery),
            );
            if (
                this.state.searchQuery.length == 2 &&
                LANGUAGES_BY_ID[this.state.searchQuery.toUpperCase()]
            ) {
                // exact ISO2 country name match: make the first result the matches ISO2
                const matched = LANGUAGES_BY_ID[this.state.searchQuery.toUpperCase()];
                displayedLanguages = displayedLanguages.filter((l) => {
                    return l.id != matched.id;
                });
                displayedLanguages.unshift(matched);
            }
        } else {
            displayedLanguages = LANGUAGES;
        }

        if (displayedLanguages.length > MAX_DISPLAYED_ROWS) {
            displayedLanguages = displayedLanguages.slice(0, MAX_DISPLAYED_ROWS);
        }

        const options = displayedLanguages.map((language) => {
            return <div key={language.value}>
                {language.label}
            </div>;
        });

        // default value here too, otherwise we need to handle null / undefined
        // values between mounting and the initial value propgating
        const language = navigator.language || navigator.userLanguage;
        const value = this.props.value || language;

        return <Dropdown className={this.props.className}
            onOptionChange={this.props.onOptionChange} onSearchChange={this._onSearchChange}
            value={value}
        >
            {options}
        </Dropdown>
    }
}

LanguageDropdown.propTypes = {
    className: React.PropTypes.string,
    onOptionChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.string,
};
