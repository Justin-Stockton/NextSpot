# NextSpot

> _Airbnb Clone_

- 'NextSpot' is designed for users to plan out their next getaway. Users will be able to book trips to destinations ('Spots') that they would like to visit and leave a review of spots.

# Technologies & Tools

|                                                                        React                                                                        |                                                                        Redux                                                                         |                                                                                   Flask                                                                                   | SQLAlchemy                                                                                                                                                                                  |                                                                              PostgreSQL                                                                              |
| :-------------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <a href="https://reactjs.org/"><img src='https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' width="75" height="75" /></a> | <a href='https://redux.js.org/'><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" width="75" height="75" /></a> | <a href='https://flask.palletsprojects.com/en/2.1.x/'><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" width="75" height="75"/></a> | <div align="center"><a href='https://www.sqlalchemy.org/'><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlalchemy/sqlalchemy-plain.svg" width="75" height="75" /></a></div> | <a href='https://www.postgresql.org/'><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="75" height="75" /></a> |

### [Live link to NextSpot](https://NextSpot-app.herokuapp.com/)

### [Link to the NextSpot Wiki](https://github.com/Justin-Stockton/NextSpot/wiki)

### [NextSpot's Features](https://github.com/Justin-Stockton/NextSpot/wiki/Features)

### [The Database Schema](https://github.com/Justin-Stockton/NextSpot/wiki/Database-Schema)

## Site Preview
### Landing page
![image](https://user-images.githubusercontent.com/99220434/184055341-2efb87d0-7387-4fa1-8079-d5d3cfc5c994.png)

### Login Modal
![image](https://user-images.githubusercontent.com/99220434/184055466-4d5aeb29-4e63-4705-842f-453acedcb7c4.png)

### Profile Modal
![image](https://user-images.githubusercontent.com/99220434/184055525-bd4f45f4-182a-4eaa-8b04-4439bbd0870d.png)

### Booking Page with no bookings
![image](https://user-images.githubusercontent.com/99220434/184055597-d4d07f3c-70c1-4a03-b081-9ed97b8db7bf.png)
### Booking Page with a booking
![image](https://user-images.githubusercontent.com/99220434/184056070-85372fc4-ebb8-4d77-8e4a-d84744f4c1ee.png)


### Spot Page view
![image](https://user-images.githubusercontent.com/99220434/184055678-6ddec54a-61b6-42b3-a78e-1a542ce4a7f5.png)

### Booking Form
![image](https://user-images.githubusercontent.com/99220434/184055723-5f7c92f7-ba4d-420f-b3ff-4b78c9c20880.png)

### Spot Review Modal
![image](https://user-images.githubusercontent.com/99220434/184055787-098f2aba-fad6-4e74-8fe7-349c4bcd20a8.png)

### Edit a Review Modal
![image](https://user-images.githubusercontent.com/99220434/184055893-aee464ed-9065-42d9-931b-70f2b4b7f831.png)




## Development

### Want to contribute?

To fix a bug or add a feature, follow these steps:

- Fork the repository

- Create a new branch with git checkout -b feature-branch-name

- Make appropriate changes to the files and push back to github

- Create a Pull Request

  - Use a clear and descriptive title for the issue to identify the suggestion.

  - Include any relevant issue numbers in the PR body, not the title.

  - Provide a comprehensive description of all changes made.

## Setting Up and Starting a Local Server:

- Clone [the project](https://github.com/Justin-Stockton/NextSpot.git).
- Create a DB and a DB User with ownership of the DB.
- Create a .env file using the .env.example provided in the project.
- cd into the fronted directory by running `cd frontend/` in your terminal then run `npm install`
- Now in the root directory run `pipenv install --python "$PYENV_ROOT/versions/3.9.4/bin/python"` followed by `pipenv shell`.
- Next you will need to set up your backend in your root terminal run `flask db migrate` followed by `flask db upgrade` and finally `flask seed all`.
  - You can now run the command `flask run` and your backend will start up connected to an already seeded database.
- Now that your backend is up and running you can open a second terminal and run `cd frontend/` followed by running `npm start`
  - This will atomatically start the application on localhost:3000 unless you have something already running on that port.

## Bugs

I love squishing bugs! If you find one, let us know by opening an issue [here](https://github.com/Justin-Stockton/NextSpot/issues). Be sure to be clear in the description of the bug (i.e. what was input into the field that caused the bug, or where you were/ what you were doing at the time you spotted the bug). Screenshots or recordings greatly help to narrow down what the problem could be!

### Created By

[Justin Stockton](https://github.com/Justin-Stockton)
