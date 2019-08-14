
# split seq to equal items
# @param {seq} list
# @param {num} equal nums
def chunkIt(seq, num):
  num = int(len(seq) / num)
  return [seq[i:i+num] for i in range(0, len(seq), num)]
