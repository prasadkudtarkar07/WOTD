# WOTD


API is used to get the word of the day.
API uses a dictionary created in database using mongodb atlas.
It gives hashset to keep track of previous words of the day.
It checks for the request date and a date when the word is generated.
If both are same it gives the same word or it updates the date and the word.
Additionally, it has POST method to add new words to the dictionary and also supports error handling.
