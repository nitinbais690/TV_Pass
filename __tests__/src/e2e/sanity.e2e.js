import wd, { Asserter } from 'wd';
import * as capabilities from './capabilities';
import {
    DEVICE_TIMEOUT,
    JEST_TIMEOUT,
    TARGET_PLATFORM,
    POLL_FREQUENCY,
    PLAYBACK_START_WAIT_TIME,
    INTERFACE_IDIOM,
} from './constants';

// TODO: update to check simulator vs device.
const IOS_SIMULATOR = TARGET_PLATFORM === 'ios';
const TVOS_SIMULATOR = TARGET_PLATFORM === 'tvos';

//Identify tv or mobile device to run specific testcases
const IS_TV = INTERFACE_IDIOM === 'tv';

// Use this to skip any tests (e.g. Skip Playback tests on iPhone Simulator)
const skipIt = condition => (condition ? it.skip : it);

// App
const ID_HOME_TAB = 'Home Tab';
const ID_SEARCH_TAB = 'Search';
const ID_SETTINGS_TAB = 'Settings';
const ID_DISMISS_ALL = 'Dismiss All';
const ID_ERROR_DISMISS = 'redbox-dismiss';
const ID_BACK_BUTTON = 'header-back';

// Home
const ID_ON_DEMAND = 'ON DEMAND';
const ID_LIVE_TV = 'LIVE TV';
const ID_CARD_VIEW = 'Card View';

// Details
const ID_DETAILS_SCREEN = 'Details Screen';
const ID_WATCH_NOW = 'Watch Now';
const ID_FAVORITE = 'Favorite';
// Player
const ID_PLAYER_SCREEN = 'Player Screen';
const ID_TIME_ELAPSED = 'Time Elapsed';
const ID_PLAYER = 'Player';
const ID_PLAY = 'Play';
const ID_REWIND = 'Rewind';
const ID_FORWARD = 'Forward';

// Search
const ID_SEARCH_BAR = TARGET_PLATFORM === 'ios' || TARGET_PLATFORM === 'tvos' ? 'searchInput' : 'Search Bar';
const ID_SEARCH_RESULTS = 'Search Results';
const ID_SEARCH_ERROR = 'Search Error';

/**
 * Custom Asserter function that validates the presence or absence of given element
 * @param {*} accessibilityId The accessibilityId with which to identify the element
 * @param {*} expected The expected presence or absence of the element in boolean. Use true for presence and false for absence.
 */
const elementWithAccessibilityId = (accessibilityId, expected) => {
    return new Asserter(function(target, cb) {
        target.hasElementByAccessibilityId(accessibilityId, function(err, isPresent) {
            cb(err, expected === isPresent);
        });
    });
};

describe('B2B Showcase App', () => {
    let driver;
    beforeAll(async () => {
        jest.setTimeout(JEST_TIMEOUT);

        const { capabilities: deviceConfig, ...serverConfig } = capabilities[TARGET_PLATFORM];

        console.debug(
            '[beforeAll] initializing driver serverConfig %j and capabilities %j',
            serverConfig,
            deviceConfig,
        );

        // Connect to Appium server
        driver = await wd.promiseChainRemote(serverConfig);

        // Start the session
        await driver.init(deviceConfig).setImplicitWaitTimeout(DEVICE_TIMEOUT);

        console.info('[beforeAll] driver initialized %j', driver);
    });

    afterAll(async () => await driver.quit());

    const dismissWarnings = async () => {
        let isErrorDismissVisible = await driver.hasElementByAccessibilityId(ID_ERROR_DISMISS);
        let isDismissAllVisible = await driver.hasElementByAccessibilityId(ID_DISMISS_ALL);

        if (isErrorDismissVisible) {
            await driver.elementByAccessibilityId(ID_ERROR_DISMISS).click();
        }
        if (isDismissAllVisible) {
            await driver.elementByAccessibilityId(ID_DISMISS_ALL).click();
        }
    };

    describe('Tab Bar', () => {
        beforeAll(async () => {
            dismissWarnings();
        });

        it('should show all the tabs', async () => {
            // expect(await driver.hasElementById('Home Tab')).toBe(true);
            if (IS_TV) {
                expect(await driver.hasElementByAccessibilityId(ID_ON_DEMAND)).toBe(true);
                expect(await driver.hasElementByAccessibilityId(ID_LIVE_TV)).toBe(true);
            } else {
                expect(await driver.hasElementByAccessibilityId(ID_HOME_TAB)).toBe(true);
            }

            expect(await driver.hasElementByAccessibilityId(ID_SEARCH_TAB)).toBe(true);
            expect(await driver.hasElementByAccessibilityId(ID_SETTINGS_TAB)).toBe(true);
        });
    });

    describe('Search Screen', () => {
        let searchBar;
        beforeAll(async () => {
            // Select Search Tab
            // Skipping tvos temporarily as we have a defects in search. search bar is not clickable and navigating to search makes home tab blank
            //TODO: Enable search testcases for tvos
            if (!TVOS_SIMULATOR) {
                await driver.elementByAccessibilityId(ID_SEARCH_TAB).click();
                searchBar = await driver.elementByAccessibilityId(ID_SEARCH_BAR);
            }
        });
        skipIt(TVOS_SIMULATOR)('should show results for search query', async () => {
            dismissWarnings();
            // type-in search query
            await searchBar.type('Max').hideDeviceKeyboard();
            expect(await driver.hasElementByAccessibilityId(ID_SEARCH_RESULTS)).toBe(true);
        });

        skipIt(TVOS_SIMULATOR)('should show error results for an invalid search query', async () => {
            dismissWarnings();
            // type-in junk search query
            await searchBar
                .clear()
                .type('sdfwe345435sdsdf324')
                .hideDeviceKeyboard();
            expect(await driver.hasElementByAccessibilityId(ID_SEARCH_ERROR)).toBe(true);
        });
    });

    describe('Home Screen', () => {
        const selectCard = async (cardViews, cardIndexToSelect) => {
            const totalCards = cardViews.length;
            if (cardIndexToSelect === undefined) {
                if (TARGET_PLATFORM === 'android') {
                    const randomIndex = Math.floor(Math.random() * totalCards);
                    return cardViews[randomIndex];
                }

                // iOS seems to return even non-visible cards, but clicking them does not work.
                // So, we pick the first visible element.
                let selectedCard;
                for (let index = 0; index < totalCards; index++) {
                    const v = cardViews[index];
                    const isVisible = await v.getAttribute('visible');
                    const isCardView = await v.getAttribute('name');
                    if (isVisible === 'true' && isCardView === 'Card View') {
                        selectedCard = v;
                        break;
                    }
                }
                return selectedCard;
            } else {
                return cardViews[cardIndexToSelect];
            }
        };

        beforeAll(async () => {
            // Select Home Tab
            dismissWarnings();
            IS_TV
                ? await driver.elementByAccessibilityId(ID_ON_DEMAND).click()
                : await driver.elementByAccessibilityId(ID_HOME_TAB).click();
        });

        it('should show catalog tabs', async () => {
            expect(await driver.hasElementByAccessibilityId(ID_ON_DEMAND)).toBe(true);
            expect(await driver.hasElementByAccessibilityId(ID_LIVE_TV)).toBe(true);
        });

        it('should navigate to details when clicking a card', async () => {
            const cardViews = await driver.elementsByAccessibilityId(ID_CARD_VIEW);

            let selectedCard = await selectCard(cardViews, 0);
            await selectedCard.click();

            expect(await driver.hasElementByAccessibilityId(ID_DETAILS_SCREEN)).toBe(true);
            expect(await driver.hasElementByAccessibilityId(ID_FAVORITE)).toBe(true);
        });

        skipIt(IOS_SIMULATOR)('should navigate to player screen', async () => {
            if (await driver.hasElementByAccessibilityId(ID_WATCH_NOW)) {
                await driver.elementByAccessibilityId(ID_WATCH_NOW).click();
            } else {
                const cardViews = await driver.elementsByAccessibilityId(ID_CARD_VIEW);
                let selectedCard = await selectCard(cardViews, 0);
                await selectedCard.click();
            }

            expect(await driver.hasElementByAccessibilityId(ID_PLAYER_SCREEN)).toBe(true);
        });

        skipIt(IOS_SIMULATOR || TVOS_SIMULATOR)('should begin video playback', async () => {
            await driver.waitFor(
                elementWithAccessibilityId(ID_TIME_ELAPSED, false),
                PLAYBACK_START_WAIT_TIME,
                POLL_FREQUENCY,
            );

            await driver.elementByAccessibilityId(ID_PLAYER).click();
            await driver.waitFor(elementWithAccessibilityId(ID_PLAY, true));

            expect(await driver.hasElementByAccessibilityId(ID_PLAY)).toBe(true);
            expect(await driver.hasElementByAccessibilityId(ID_REWIND)).toBe(true);
            expect(await driver.hasElementByAccessibilityId(ID_FORWARD)).toBe(true);
        });

        skipIt(IOS_SIMULATOR || TVOS_SIMULATOR)('should fast-forward when clicked on ffd button', async () => {
            const controlsAreVisible = await driver.hasElementByAccessibilityId(ID_TIME_ELAPSED);

            if (!controlsAreVisible) {
                await driver.elementByAccessibilityId(ID_PLAYER).click();
                await driver.waitFor(
                    elementWithAccessibilityId(ID_TIME_ELAPSED, false),
                    DEVICE_TIMEOUT,
                    POLL_FREQUENCY,
                );
            }

            const initialTimeElapsed = await driver.elementByAccessibilityId(ID_TIME_ELAPSED).text();

            await driver.elementByAccessibilityId(ID_FORWARD).click();
            // Wait for video to load after seeking
            await driver.waitFor(
                elementWithAccessibilityId(ID_FORWARD, true),
                PLAYBACK_START_WAIT_TIME,
                POLL_FREQUENCY,
            );

            const seekedTimeElapsed = await driver.elementByAccessibilityId(ID_TIME_ELAPSED).text();
            expect(seekedTimeElapsed).not.toBe(initialTimeElapsed);
        });

        skipIt(IOS_SIMULATOR || TVOS_SIMULATOR)(
            'should resume playback after moving to background and back',
            async () => {
                const controlsAreVisible = await driver.hasElementByAccessibilityId(ID_TIME_ELAPSED);
                if (!controlsAreVisible) {
                    await driver.elementByAccessibilityId(ID_PLAYER).click();
                    await driver.waitFor(
                        elementWithAccessibilityId(ID_TIME_ELAPSED, false),
                        DEVICE_TIMEOUT,
                        POLL_FREQUENCY,
                    );
                }

                const initialTimeElapsed = await driver.elementByAccessibilityId(ID_TIME_ELAPSED).text();

                await driver.elementByAccessibilityId(ID_PLAY).click();
                await driver.backgroundApp(1);

                // We need an explicit sleep wait here to determine if playback has progressed/resumed automatically.
                await driver.sleep(1000);

                const controlsAreVisible1 = await driver.hasElementByAccessibilityId(ID_TIME_ELAPSED);
                if (!controlsAreVisible1) {
                    await driver.elementByAccessibilityId(ID_PLAYER).click();
                    await driver.waitFor(
                        elementWithAccessibilityId(ID_TIME_ELAPSED, true),
                        DEVICE_TIMEOUT,
                        POLL_FREQUENCY,
                    );
                }

                const timeElapsed = await driver.elementByAccessibilityId(ID_TIME_ELAPSED).text();
                expect(timeElapsed).not.toBe(initialTimeElapsed);
            },
        );
    });

    describe('Settings Screen', () => {
        beforeAll(async () => {
            // Select Settings Tab
            const isPlatformAndroid = TARGET_PLATFORM === 'android' || TARGET_PLATFORM === 'firetv';
            if (isPlatformAndroid) {
                await driver.backgroundApp(1);
            } else {
                await driver.elementByAccessibilityId(ID_BACK_BUTTON).click();
            }

            await driver.elementByAccessibilityId(ID_SETTINGS_TAB).click();
        });

        skipIt(TVOS_SIMULATOR)('should show app preferences', async () => {
            expect(await driver.hasElementByAccessibilityId('Settings Preferences')).toBe(true);
        });

        skipIt(TVOS_SIMULATOR)('should be able to switch app theme', async () => {
            await driver.elementByAccessibilityId('Switch to Use Default Component Theme').click();
            // App should reload with new theme on the home page
            expect(await driver.hasElementByAccessibilityId(ID_ON_DEMAND)).toBe(true);
        });
    });
});
