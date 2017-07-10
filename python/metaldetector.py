
import time, threading

isOcupated = False
# if the second counter find an activity > 10 is ocupated = false
secondsCounter = 0

def foo(recivedBool):
    global secondsCounter
    global isOcupated
    if recivedBool:
         secondsCounter = secondsCounter + 1
    else:
         secondsCounter = 0
         if isOcupated:
            print("the spot is free now")
         isOcupated = False
    if secondsCounter > 10 and isOcupated == False:
         isOcupated = True
         print("the spot has been occupied")
    if secondsCounter > 0 and secondsCounter < 10:
        print("the car is parking")


print("check activity of sensor")


while True:
    # here i must to find if i find a signal from device
    foo(True)
    time.sleep(1)
    # threading.Timer(1000, foo(True)).start()

# https://parking-area-santy-ruler.c9users.io:8082/