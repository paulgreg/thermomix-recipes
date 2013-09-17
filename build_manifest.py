#!/usr/bin/python
#
# Script to build manifest file, from Google html5 slides
#
# Copyright (C) 2010 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


__author__ = 'ericbidelman@chromium.org (Eric Bidelman)'

import os
import datetime

MANIFEST = 'cache.manifest'

def produce_manifest_entries(dir):
  files = os.walk(dir)
  l = []
  for root, currdir, fileList in files:
    # Filter out .git directories.
    if not '.git' in root:
      # Need to exclude large files because of AppCache 5MB limit.
      exclude_list = ['.mp3', '.mp4', '.ogv', '.ogg', '.webm', '.DS_Store']
      l.extend('%s/%s\n' % (root.replace('\\', '/'), f)  for f in fileList
               if f[f.rfind('.'):] not in exclude_list)
  return l

if __name__ == '__main__':

  f = open(MANIFEST, 'w')
  f.write('CACHE MANIFEST\n')

  # Update manifest's version timestamp on every run to force the cache update.
  f.write('#%s\n\n' % str(datetime.datetime.now()))
  f.write('index.html\n')
  for d in ['js', 'css', 'css/themes/default/images', 'imgs', 'ini']:
    f.writelines(produce_manifest_entries(d))
  f.write('\nNETWORK:\n*\n')

  f.close()
