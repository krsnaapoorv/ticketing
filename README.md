# ticketing

#Name - Wtcher's

Web Application:- client side

1.Home Page- Select movie,filter movie

2.Registration/signup Page

3.Login Page

4.Success Login/user details Page

5.Select movie-show different theatre

6.Select Theatre page- Shows different screen in that theatre

7.Select Seat page- Book ticket

8.Booking page- Tickets booked by particular user



API docs:- Server side

1.User Registration

2.User Signin

3.user booking details

4.Show present movies

5.Filter movie based on language and category

6.Select theatre

7.Select Screen

8.Select Seat

9.Book Seat

10.Cancel seat

11.Show all category and language for dropdown



#Database:



#Tables

1 . users:-

    uid-primary key,auto_increment
    
    name
    
    email- unique
    
    phone
    
    password
    
    salt
    

2.  movies:

    mid-primary key,auto_increment
    
    mname
    
    cid- foreign key from category table
    
    language
    

3.  category:

    cid- primary key,auto_increment
    
    cname
    

4.  theatre:-

    tid-primary key,auto_increment
    
    tname
    
    lat
    
    longitude
    
    phone
    
    
5.  screen:-

    screenid-primary key,auto_increment
    
    screen
    
    tid - foreign key from theatre table
    
    mid- foreign key from movie table
    
    timing
    
    
6.  seats:-

    seatnid-primary key,auto_increment
    
    screenid- foreign key from screen table
    
    uid - foreign key from user table
    
    mid- foreign key from movie table
    
    booked- bool
    
    seat_no
    
7.  movietheatre:-

    mid- foreign key from movie table
    
    tid - foreign key from theatre table
