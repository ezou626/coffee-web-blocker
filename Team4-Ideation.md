# Chrome Extension Idea: LockIn Web Blocker

## Authors

Shruti Agarwal, Tiana Costello, Minfei Shen, Eric Zou

## Problem Statement

It can be very easy to lose focus on work when using the internet through a web browser like Google Chrome. In today's digital age, the internet offers a vast array of content and websites, many of which can be engaging but ultimately detract from productivity and concentration. Oftentimes, wrestling with distracting content can detract from productivity and lead to information overload and procrastination.

## Target Audience

The Chome extension is usable by all Chrome users. However, the target audience is centered around people who utilize the Internet as a means to complete their work. This could be professionals, students, founders, hobbyists, and developers. Users should be looking for a simple way to manage their web usage in order to focus better, and may struggle with being distracted by websites like social media and gaming that would not be relevant to their goals at the moment.

## Description

LockIn Web Blocker offers features to help direct your attention to what matters most, reminding you to not visit websites that you deem as irrelevant to your current activity via content replacement. UIs will be accessible via popup or a new page and should be as minimal as possible. Users can customize block lists, schedule blocking times, and track their web usage with this extension.

## Selling Points

1. **Flexible Blocking**: Customize filter lists of websites to block, and activate groups of filter lists during each task
2. **Built-in Scheduling**: Timers and schedules are available to block out time to work and take breaks, offering convenient time management functionality
3. **Native Accountability Features**: Track time usage on various websites and derive insights for improving efficiency on the web
4. **Privacy**: Personal information is stored locally, with large-scale reporting and analytics using anonymized, aggregate data
5. **Clean UI**: Our web blocker features an intuitive and neat interface, allowing you to easily manage block lists and set blocking that works for you.
6. **Free**: Our web blocker is completely free, allowing users to focus solely on their web usage.
7. **Performant**: Our web blocker is optimized to run smoothly without slowing down the user's browser.

## User Stories

1. As a student, I want to block social media websites during my study sessions to maintain focus and improve my academic performance.
2. As a parent, I want to set up time limits and block inappropriate content on my child's devices to ensure a safe and productive online experience.
3. As a remote worker, I want to block non-work-related websites during designated work hours to create a more disciplined and productive routine.
4. As a gamer, I want to block gaming forums and websites during my work periods to minimize distractions and improve my academic performance.
5. As a creative professional, I want to block self-critical or negative websites during my creative sessions to foster a more positive and productive mindset.
6. As a digital minimalist, I want to block unnecessary websites and limit my online time to reduce digital clutter and increase mindfulness.
7. As a meditation practitioner, I want to block news websites and social media platforms during my meditation sessions to create a serene and distraction-free environment.
8. As a cybersecurity-conscious individual, I want to block suspicious or phishing websites to protect my personal information and enhance online security.
9. As a recovering addict, I want to block websites related to addictive substances or behaviors to support my journey towards sobriety and wellness.
10. As a financial planner, I want to block impulse-buying websites during my budgeting sessions to stick to my financial goals and avoid unnecessary expenses.
11. As a researcher, I want to block social media and news websites during my research sessions to stay focused and avoid information overload.
12. As a productivity coach, I want to recommend personalized website blocking settings to my clients based on their specific goals and challenges.
13. As an individual looking to improve my mental health, I want to block triggering or distressing websites during vulnerable moments to protect my emotional well-being and promote self-care.
14. As a developer, I require a feature in our productivity tool to block access to non-relevant websites during work hours, ensuring my focus remains on programming tasks and problem-solving without distractions.
15. As a founder, I need a web blocking extension to help me stay focused on strategic tasks and minimize distractions during critical business operations.

## Notes

### Modes
1. **À La Carte**: Set and name a time period and a set of block lists to prevent access to these websites during this time.
2. **Scheduled**: Set and name a recurring time period and a set of block lists to prevent access during this time.
3. **Work**: Alternate between periods of named blocking (work) and unblocking (breaks) with times set dynamically and with a persistent but modifiable set of block lists.

### Block Lists
- Named block lists that ideally would all center around a specific group of websites
- Users can edit these block lists in the UI or dynamically add or modify websites as they are visited

### Analytics
- Visualization of block periods and task names
- Activity/Time on websites with block lists
- Use of various block lists
- Bypasses
- Total time with blocking active

### Bypassing
- Users should be allowed to bypass and remove blocking for websites with confirmation/passwords (which prevents impulse decisions)

## References & Inspiration

https://blocksite.co/

https://www.webblockerextension.com/

## Technical Details

### User Interface (Eric)

For user-level configuration and management of block lists, we want to use the Chrome Runtime getURL API call to create a new tab in which a page will be presented with various tabs in a sidebar for each of the tasks of Block List Management, Recurring Block Scheduling, and User Settings. 

On a blocked page, we could use webRequest based redirection to open up a preconfigured block page that would remind the user about their commitment and offer them some options for convenience. 

We plan to use a popup to start impromptu blocking sessions and add local websites along with buttons that link to appropriate sections in the full config page for flexibility if the user needs more complicated behavior. We believe that we can keep this popup minimal in its content and functionality. 

### API, Libraries, and Frameworks (Minfei)

#### Frontend:

- We plan to have a primarily React-based front end that incorporates Tailwind CSS for styling, potentially utilizing built component libraries such as Material-Tailwind.

#### Backend: 

- We are currently experimenting with using Plasmo as the overall framework for the extension development.
- To achieve the blocking feature, we will use Chrome WebRequest API.
- To achieve the scheduling feature, we will use the Chrome Alarms API.
- To manage tab activity such as closing or reloading tabs when a website is blocked, we will use a Chrome Tabs API.
- To save user preferences such as block list and scheduling detail, we will use Chrome Storage API.

#### DevOps:

- We plan to explore Chrome DevTools for debugging during development.

#### Documentation:

- Plasmo: [https://docs.plasmo.com/](https://docs.plasmo.com/)
- Chrome WebRequest API: [https://developer.chrome.com/docs/extensions/reference/api/webRequest](https://developer.chrome.com/docs/extensions/reference/api/webRequest)
- Chrome Alarms API: [https://developer.chrome.com/docs/extensions/reference/api/alarms](https://developer.chrome.com/docs/extensions/reference/api/alarms)
- Tabs API: [https://developer.chrome.com/docs/extensions/reference/api/tabs](https://developer.chrome.com/docs/extensions/reference/api/tabs)
- Storage API: [https://developer.chrome.com/docs/extensions/reference/api/storage](https://developer.chrome.com/docs/extensions/reference/api/storage)
- Chrome DevTools for Extension Debugging: [https://developer.chrome.com/docs/extensions/get-started/tutorial/debug](https://developer.chrome.com/docs/extensions/get-started/tutorial/debug)

### Data Storage (Shruti)

[Explain what data you might need to store, and provide some overview of the models—that is, the structure of the data.]

#### Data to store:

- Block Lists: separate groups of URLs/websites that the user wants to block “together”
- Schedules: recurring time block to engage subset of block lists

#### Further extensions:

For analytics purposes, we can extend our data model beyond local browser storage to include an offsite backend database to store information across all users. This information could consist of time spent adhering to block lists, how often a user “violates” their time schedule relative to others, etc. This would require a more robust backend data model, which we will explore as an extension if time permits. 

We plan to use Chrome Storage, using storage.local to store data locally (up to 10MB) and then using storage.sync to sync this storage to ANY Chrome browser the user is logged into. This way the risk of circumventing block lists via multiple browsers is mitigated. 

[https://developer.chrome.com/docs/extensions/reference/api/storage](https://developer.chrome.com/docs/extensions/reference/api/storage) 

## Project Management

### Collaboration and Task Allocation

#### Leader: Eric Zou

- Design UI
- Outline/test features
- Share in dev/deployment work

#### Manager: Minfei Shen

- Ensure timeline is followed
- Outline/test features
- Share in dev work

#### Lead Dev: Shruti Agarwal

- Design system components
- Select frameworks
- Divide development work

#### DevOps Lead: Tiana Costello

- Setup deployment pipeline (Github Actions maybe?)
- Share in dev work

### Risks and Mitigation (Tiana)

- Privacy and data security risks: Handling user data, especially when tracking website usage, could raise privacy concerns. Use local storage for user data and anonymize analytics to ensure privacy.
- Browser compatibility: Regularly update the extension and employ feature detection to maintain functionality. Modular design will allow for quick adaptation to Chrome updates.
- Technical bugs: Implement comprehensive testing and a user feedback system for bug reporting. Ensure a quick fix deployment process is in place.
- Overcomplication: Adding too many features or making the system unintuitive/cluttered might be risks, which could limit the effectiveness of the extension

### Milestones and Timeline

#### Week 1: 

- Conceptualization
- Initial design
- Development environment setup

#### Week 2

- Development of blocking functionality
- Basic UI in React
- Page and popup creation

#### Week 3

- Implementation of advanced features (scheduling, analytics)
- Test deployments
- UI styling

#### Week 4

- Final testing
- Bug fixes
- Final launch
