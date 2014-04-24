from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer

class SimpleEcho(WebSocket):

	def handleMessage(self):
		if self.data is None:
			self.data = ''
		
		print str(self.data)
			
	def handleConnected(self):
		print self.address, 'connected'

	def handleClose(self):
		print self.address, 'closed'


server = SimpleWebSocketServer('', 9090, SimpleEcho)
server.serveforever()
