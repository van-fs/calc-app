# Calculator

Here at Abacus Technology Limited (ATL for short), we're working on something revolutionary. We call it the "calculator". Now we think it's going to be pretty big, but we're still trying to get it right. That's where you come in.

Since the calculator is so different from our abacus interface, we're using [FullStory](http://fullstory.com) in our prototype to help our designers see how you use it. If something breaks, don't worry. We'll automatically log a GitHub issue and assign one of our developers to investigate.

So get out there and start crunching some numbers.

![](/screenshots/app.png)

## Usage

Access the live demo [here](http://fs-calc.mybluemix.net).

Press a few numeric buttons like `7` or `77` followed by an operand such as `+` and then a few more numeric buttons. When you're ready to see the result, press the `=` button.

## Break it

Now something as futuristic as the "calculator" isn't without bugs. We want you to find them. Which button combinations are invalid? Which combinations should work but don't? You decide, and we'll fix it. (Hint, you can hit an operand first which will break it.)

![](/screenshots/bug.png)

## Fix it

Inside the calculator is a complex set of instructions. To make fixing bugs easier, we're using [FullStory](http://fullstory.com) to:
1. Provide a session replay link as part of every GitHub issue
2. Recreate the state of the calculator at the time of the error

Since FullStory tracks application events, we can use these events to reproduce the exact sequence of user-interactions leading up to an error. No more "works for me" situations.

![](/screenshots/debugger.gif)

1. Open the debugger using the menu button and Debugger item.
2. Enter a GitHub issue number from the [issues](https://github.com/van-fs/calc-app/issues) page. For example, enter `29`. (Alternatively, you can also manually load the events using the textarea if you wanted to export them manually from the User page.)
3. Click the filter icon to load the events. (Optionally filter based on session ID or start timestamp if you've manually loaded the events.)
4. Click the play button to recreate the entire state, use the step button to execute each event in sequence, or click the individual event to fire the associated button.

## Fun facts

1. A `fullstory.component.ts` is used to dynamically inject FullStory into the DOM. While adding a script include in `<head>` is preferred, this way was used to prevent recording when doing local development.
2. CSS selectors are used to correlate FullStory events to buttons in the calculator. Since a selector could match multiple buttons (i.e. CSS styling for `7` also matches `8`), the text is used to further identify the button.
3. The CSS selector is also processed to remove certain classes. For example, FullStory records when the button is pressed, which has different styling than when the button is not. To support the debugger, these styles are removed.
4. The timestamp in the GitHub issue is used to locate a FullStory bundle using the REST API.

## Run it yourself

Run the app in development mode.

1. Run `npm install`.
2. Run `ng serve`.

## Learn more

Check out [FullStory](http://fullstory.com) for more you can do.
