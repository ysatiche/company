# -*- coding: UTF-8 -*-
import synonyms
# python test 

sen1 = '自己出现一个时间点'
sen2 = '自动加了时间节点'
r = synonyms.compare(sen1, sen2, seg=True)
print(r)

