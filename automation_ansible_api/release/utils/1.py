


def base(host,module,**kwargs):
	print(host)
	print(module)
	print(kwargs)



if __name__ == '__main__':
	s = {'a':1}

	base('1.1.1.1','shell',**s)
