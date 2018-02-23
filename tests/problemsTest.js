module.exports = {
    'Patient Headings Problems/Diagnosis': function (browser) {

        browser.page.loginPage()
            .login();

        var patientSummaryPage = browser.page.patientSummaryPage();

        patientSummaryPage.handlePopUp();

        const tab = "problems";
        const nameFirstPart = 'bronchitis';

        browser.globals.deleteTestItems(browser, tab, "problem", nameFirstPart);

        browser.pause(browser.globals.wait_milliseconds_shortest);
        leftBarMenu = patientSummaryPage.section.leftBarMenu;

        leftBarMenu.waitForElementVisible('@problems', browser.globals.wait_milliseconds_shortest)
            .click('@problems');

        var problems = patientSummaryPage.section.problems;
        browser.pause(browser.globals.wait_milliseconds_shortest);
        problems.waitForElementVisible('@createButton', browser.globals.wait_milliseconds_shortest)
            .click('@createButton');

        var createProblemForm = patientSummaryPage.section.createProblemForm;

        var time = new Date().getTime();
        const name = nameFirstPart + ' ' + time;
        createProblemForm.waitForElementPresent('@problemInput', browser.globals.wait_milliseconds_shortest)
            .setValue('@problemInput', name)
            .click('@calendar');
        browser.pause(browser.globals.wait_milliseconds_shortest);

        const date = '20-Nov-2017';
        browser.globals.pickDate(browser, date);
        browser.pause(browser.globals.wait_milliseconds_shortest);

        const description = 'Bronchitis is inflammation of the bronchi in the lungs.';
        createProblemForm.setValue('@descriptionInput', description);
        browser.execute("window.scrollTo(0,document.body.scrollHeight);"); //scroll down
        createProblemForm.click('@completeButton')
            .waitForElementNotPresent('@problemInput', browser.globals.wait_milliseconds_shortest);

        browser.pause(browser.globals.wait_milliseconds_short);
        browser.refresh();
        browser.pause(browser.globals.wait_milliseconds_shortest);

        problems.waitForElementVisible('@filterButton', browser.globals.wait_milliseconds_shortest)
            .click('@filterButton')
            .waitForElementVisible('@filterInput', browser.globals.wait_milliseconds_shortest)
            .setValue('@filterInput', time);
        browser.pause(browser.globals.wait_milliseconds_shortest)
            .useXpath()
            .waitForElementVisible('//td[.="' + name + '"]', browser.globals.wait_milliseconds_shortest)
            .click('//td[.="' + name + '"]');

        const chronic = " chronic";
        const newName = name + chronic;
        const newDescription = description + chronic;
        browser.pause(browser.globals.wait_milliseconds_shortest);
        browser.pause(browser.globals.wait_milliseconds_shortest);
        createProblemForm.waitForElementVisible('@problemLabel', browser.globals.wait_milliseconds_shortest)
            .assert.containsText('@problemLabel', name)
            .assert.containsText('@descriptionLabel', description)
            .assert.containsText('@dateLabel', date)
            .assert.visible('@terminologyLabel')
            .click('@editButton')
            .waitForElementPresent('@problemInput', browser.globals.wait_milliseconds_shortest)
            .setValue('@problemInput', chronic)
            .setValue('@descriptionInput', chronic);
        browser.pause(browser.globals.wait_milliseconds_shortest);
        browser.execute("window.scrollTo(0,document.body.scrollHeight);"); //scroll down
        createProblemForm.click('@completeButton');
        browser.pause(browser.globals.wait_milliseconds);
        createProblemForm.waitForElementNotPresent('@problemInput', browser.globals.wait_milliseconds_shortest)
            .waitForElementVisible('@problemLabel', browser.globals.wait_milliseconds_shortest)
            .assert.containsText('@problemLabel', newName)
            .assert.containsText('@descriptionLabel', newDescription)
            .assert.containsText('@dateLabel', date);

        browser.globals.deleteCurrentItem(browser, tab);

        browser.end();
    }
};