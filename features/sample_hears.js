/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = function(controller) {

    controller.hears(async (message) => message.text && message.text.toLowerCase() === 'help', ['message'], async (bot, message) => {
        await bot.reply(message, `Welcome to the channel. I will respond to some commands and give you Nobel prize winners. Just say "Nobel [year] [prize type]." For example, "Nobel 1929 Literature" will respond "Thomas Mann won the 1929 Nobel Prize for Literature." Valid years and prize types are: 1901-2019 (except some of 1914-19 and 1939-44) for Chemistry, Literature, Medicine, Peace, and Physics, and 1969-2019 for Economics. P.S. Don't say "Goodbye".`);
    });

    controller.hears(async (message) => message.text && message.text.toLowerCase() === 'goodbye', ['message'], async (bot, message) => {
        await bot.reply(message, 'You say, "Goodbye" and I say, "Hello, hello, hello."');
    });

    controller.hears(async (message) => message.text && message.text.split(' ')[0] === 'Nobel', ['message'], async (bot, message) => {
        const year = message.text.split(' ')[1];
        const category = message.text.split(' ')[2];
        await fetch('http://api.nobelprize.org/v1/prize.json')
            .then(res => res.json())
            .then(data => {
                let winners = '';
                for (let i = 0; i < data.prizes.length; i++) {
                    let curr = data.prizes[i];
                    if (winners) break;
                    if (curr.year === year.toString() && curr.category === category.toLowerCase()) {
                        for (let i = 0; i < curr.laureates.length; i++) {
                            if (winners) winners += ', ';
                            winners += `${curr.laureates[i].firstname} ${curr.laureates[i].surname}`;
                        }
                    }
                }
                return winners;
            })
            .then(winners => {
                if (!winners) bot.reply(message, 'Not a valid year or prize. Valid years and prize types are: 1901-2019 (except some of 1914-19 and 1939-44) for Chemistry, Literature, Medicine, Peace, and Physics, and 1969-2019 for Economics.');
                else {bot.reply(message, `${winners} won the ${year} Nobel Prize for ${category}`)}})
            .catch(error => console.log('Error', error));
    });

    controller.hears(['allcaps', new RegExp(/^[A-Z\s]+$/)], ['message','direct_message'], async function(bot, message) {
        await bot.reply(message,{ text: 'I HEARD ALL CAPS!' });
    });

}