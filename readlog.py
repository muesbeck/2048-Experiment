#! /usr/bin/python
from datetime import datetime
import sys

colorred = "\033[01;42m{0}\033[00m"
colorgrn = "\033[1;36m{0}\033[00m"
guids = []

def readFile(filename):
    try:
        f = open(filename)
        lines = f.readlines()
        f.close()
        return lines
    except IOError:
        pass

def parseLines(lines):
    lastline= ""
    count = 0
    print 'Number;Type;Score;Turns;HasWon;Runtime'
    if lines is not None:
        for s in lines:
            count += 1
            tmp = s.split(";")
            lineString = str(count) + ';'
            nrP = 0
            duplicate = False
            for smi in tmp:
                if smi.startswith( 'Date:' ):
                    nrP += 1
                    lineString += handle_date(smi)
                elif smi.startswith( 'Type:' ):
                    nrP += 1
                    lineString += handle_easy_split(smi)
                elif smi.startswith( 'Guid:' ):
                    if handle_guid(smi):
                        duplicate = True
                elif smi.startswith( 'Score:' ):
                    nrP += 1
                    lineString += handle_easy_split(smi)
                elif smi.startswith( 'Turns:' ):
                    nrP += 1
                    lineString += handle_easy_split(smi)
                elif smi.startswith( 'WonStatus:' ):
                    nrP += 1
                    lineString += handle_easy_split(smi)
                elif smi.startswith( 'TimeTaken:' ):
                    nrP += 1
                    lineString += handle_last_split(smi)
            # Only print if full line
            if nrP == 6 and not duplicate:
                printable = lineString.replace('\n', '')
                print printable

def handle_date(smi):
    return ""

def handle_easy_split(smi):
    tmp = smi.split(' ')
    if len(tmp) >= 2:
        return tmp[1] + ';'
    else:
        return 'xxxxxx'

def handle_last_split(smi):
    tmp = smi.split(' ')
    if len(tmp) >= 2:
        return tmp[1]
    else:
        return 'xxxxxx'

def handle_guid(smi):
    tmp = smi.split(' ')
    if len(tmp) >= 2:
        if tmp[1] in guids:
            return True
        else:
            guids.append(tmp[1])
    return False

if len(sys.argv) > 1:
    lines = readFile(sys.argv[1])
    c = parseLines(lines)
else:
    print "No arguments, please provide path to file"
