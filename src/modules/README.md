> Hygen is an automatic code generator

> Install hygen to run the commands . Install hygen with brew `brew install hygen`, If you can't install with brew then use `npx hygen`

> To generate a new container run `hygen container new containername`. when we run the command you will get the below questionnaire .

> `Include components? (y/N)`- If you plan to have components outside screens or shared
> `Include assets? (y/N)` - If you plan to add images to screens
> `Include widget? (y/N)` - if you plan to add widget to home screen
> `Include logic? (y/N)` - if you plan to call APIs or have some logic when loading screens
> `Include store? (y/N)` - If the container needs to have its own global state management (usually no)
> `Include deepLink? (y/N)` - If you plan to use deeplink from push notification to any container's screen

> from project route: hygen

> Available actions:
> api: help, new
> container: help, new
> icon: help, new

> To add an api we need to download the api from swagger as json and provide the path in the command
> `hygen api new ~/Downloads/10x-Banking-10x_Payments-4.9.0-resolved.json`

> Before we run the command to add the icon we need to have icon as svg format in svg-icons.
> run the command to add iocn `hygen icon new 'name of the icon saved in svg-icons` and icon will be created in `iconList`.

> also in container path: hygen

> Available actions:
> screen: help, new
> widget: help, new

> To add a screen to the conatiner (you need to be in the conatiner) run the command `hygen screen new screenName`. when you run the command you will get the questionnarie

> `Include components? (y/N)` > `Include assets? (y/N)` -
> `Include widget? (y/N)` -
> `Include logic? (y/N)` -
> `Include store? (y/N)` -
> `Include deepLink? (y/N)` -

> To add a widget to the conatiner (you need to be in the conatiner) run the command `hygen widget new widgetName`. when you run the command you will get the questionnarie
> `Include logic? (y/N)`

> Code will be generated successfully after running all the above commands.

> onboarding is a special case of container

> For new onboarding flow you need to be in `src/containers/onboarding/`
> Run the command ` hygen onboarding new` and you will get below questionnaire
> `What is the onboarding name (residential, loans, etc.)? ›` enter the name

> To create a new step run `hygen step new` and choose the target onboarding from the options
> once user select the target onbaording you will get below questionnaire
> `What is this onboarding step name?` Enter the step name
> `Which type of Onboarding?` select the type from the options
> `Include assets? (y/N) › false` - If the onboarding flow have assests add assests by typing y
> `Include inputs? (y/N) › false` - If the onboarding flow have inputs then add inputs
> `Include API? (y/N) › false` - if the onboarding flow have api calls the add API
