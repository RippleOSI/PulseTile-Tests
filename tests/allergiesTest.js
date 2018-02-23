module.exports = {
    'Patient Headings Allergies': function (browser) {
        browser.page.loginPage()
            .login();

        var patientSummaryPage = browser.page.patientSummaryPage();

        patientSummaryPage.handlePopUp();

        browser.pause(browser.globals.wait_milliseconds_shortest);
        leftBarMenu = patientSummaryPage.section.leftBarMenu;

        const tab = "allergies";
        const newCauseFirstPart = 'Antibiotics';
        const causeFirstPart = 'allergy to Aspirin';

        browser.globals.deleteTestItems(browser, tab, "cause", causeFirstPart);
        browser.globals.deleteTestItems(browser, tab, "cause", newCauseFirstPart);

        leftBarMenu.waitForElementVisible('@allergies', browser.globals.wait_milliseconds_short)
            .click('@allergies');

        allergies = patientSummaryPage.section.allergies;
        browser.pause(browser.globals.wait_milliseconds_shortest);
        allergies.waitForElementVisible('@createButton', browser.globals.wait_milliseconds_shortest)
            .click('@createButton');

        var createAllergyForm = patientSummaryPage.section.createAllergyForm;

        var time = new Date().getTime();
        var cause = causeFirstPart + ' ' + time;
        var reaction = 'Fever';
        createAllergyForm.waitForElementPresent('@causeInput', browser.globals.wait_milliseconds_short)
            .setValue('@causeInput', cause)
            .setValue('@reactionInput', reaction)
            // .setValue('@terminologyInput', 'no data')
            .click('@completeButton')
            .waitForElementNotPresent('@causeInput', browser.globals.wait_milliseconds_short);

        browser.pause(browser.globals.wait_milliseconds_short);
        browser.refresh();
        browser.pause(browser.globals.wait_milliseconds_shortest);

        allergies.waitForElementVisible('@filterButton', browser.globals.wait_milliseconds_shortest)
            .click('@filterButton')
            .waitForElementVisible('@filterInput', browser.globals.wait_milliseconds_shortest)
            .setValue('@filterInput', time)
            .section.table
            .waitForElementVisible('td[data-th="Cause"]', browser.globals.wait_milliseconds_shortest)
            .click('td[data-th="Cause"]');

        browser.pause(browser.globals.wait_milliseconds_shortest);

        createAllergyForm.waitForElementVisible('@causeLabel', browser.globals.wait_milliseconds_short)
            .assert.containsText('@causeLabel', cause)
            .assert.containsText('@reactionLabel', reaction);

        var newCause = newCauseFirstPart + ' ' + time;
        var newReaction = 'Skin rash';
        createAllergyForm.click('@expandButton')
            .waitForElementVisible('@editButton', browser.globals.wait_milliseconds_short)
            .click('@editButton')
            .waitForElementPresent('@causeInput', browser.globals.wait_milliseconds_short)
            .clearValue('@causeInput')
            .setValue('@causeInput', newCause)
            .clearValue('@reactionInput')
            .setValue('@reactionInput', newReaction)
            .click('@completeButton');

        browser.pause(browser.globals.wait_milliseconds_short);

        createAllergyForm.waitForElementNotPresent('@causeInput', browser.globals.wait_milliseconds_short)
            .waitForElementVisible('@causeLabel', browser.globals.wait_milliseconds_short)
            .assert.containsText('@causeLabel', newCause)
            .assert.containsText('@reactionLabel', newReaction);

        browser.globals.deleteCurrentItem(browser, tab);

        browser.end();
    }
};