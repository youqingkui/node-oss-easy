// Generated by CoffeeScript 1.6.3
(function() {
  var FILE_NAMES, STRING_CONTENT_FOR_TESTING, STRING_CONTENT_FOR_TESTING2, fs, oss, ossEasy, ossOptions, path, should;

  require('mocha');

  should = require('chai').should();

  ossEasy = require("../oss-easy");

  fs = require("fs");

  path = require("path");

  STRING_CONTENT_FOR_TESTING = "just a piece of data";

  STRING_CONTENT_FOR_TESTING2 = "222 just a piece of data 222";

  ossOptions = {
    accessKeyId: process.env.OSS_KEY,
    accessKeySecret: process.env.OSS_SECRET
  };

  oss = new ossEasy(ossOptions, process.env.OSS_BUCKET);

  FILE_NAMES = ["" + (Date.now()) + "-t1", "" + (Date.now()) + "-t2", "" + (Date.now()) + "-t3", "" + (Date.now()) + "-t4"];

  describe("testing oss", function(done) {
    it("writeFile and readFile should work", function(done) {
      var filename;
      filename = "just-a-test";
      return oss.writeFile(filename, STRING_CONTENT_FOR_TESTING, function(err) {
        should.not.exist(err);
        return oss.readFile(filename, 'utf8', function(err, data) {
          data.should.equal(STRING_CONTENT_FOR_TESTING);
          return done();
        });
      });
    });
    it("uploadFile and downloadFile should work", function(done) {
      var filename, pathToTempFile, pathToTempFile2;
      pathToTempFile = "/tmp/" + (Date.now());
      pathToTempFile2 = "/tmp/" + (Date.now()) + "-back";
      fs.writeFileSync(pathToTempFile, STRING_CONTENT_FOR_TESTING2);
      filename = "test-file-upload-download";
      return oss.uploadFile(filename, pathToTempFile, function(err) {
        should.not.exist(err);
        return oss.downloadFile(filename, pathToTempFile2, function(err) {
          should.not.exist(err);
          fs.readFileSync(pathToTempFile2, 'utf8').should.equal(fs.readFileSync(pathToTempFile, 'utf8'));
          return done();
        });
      });
    });
    it("uploadFile in a batch should work", function(done) {
      var i, _i;
      for (i = _i = 0; _i < 4; i = _i += 1) {
        fs.writeFileSync("/tmp/" + FILE_NAMES[i], "" + STRING_CONTENT_FOR_TESTING2 + "-" + i);
      }
      return oss.uploadFileBatch(FILE_NAMES, "/tmp", function(err) {
        should.not.exist(err);
        return done();
      });
    });
    it("uploadFile in a batch with individual full file pahts, should work", function(done) {
      var filename, filenames, i, _i, _j, _len;
      for (i = _i = 0; _i < 4; i = _i += 1) {
        fs.writeFileSync("/tmp/" + FILE_NAMES[i] + "-i.tmp", "" + STRING_CONTENT_FOR_TESTING2 + "-" + i);
      }
      filenames = FILE_NAMES.concat();
      for (i = _j = 0, _len = filenames.length; _j < _len; i = ++_j) {
        filename = filenames[i];
        filenames[i] = path.join("/tmp", "" + filename + "-i.tmp");
      }
      return oss.uploadFileBatch(filenames, function(err) {
        should.not.exist(err);
        return done();
      });
    });
    it("download file in a batch should work", function(done) {
      var filename, filenames, i, pathToDownload, _i, _j, _len;
      for (i = _i = 0; _i < 4; i = _i += 1) {
        fs.writeFileSync("/tmp/" + FILE_NAMES[i] + "-i.tmp", "" + STRING_CONTENT_FOR_TESTING2 + "-" + i);
      }
      filenames = FILE_NAMES.concat();
      for (i = _j = 0, _len = filenames.length; _j < _len; i = ++_j) {
        filename = filenames[i];
        filenames[i] = "" + filename + "-i.tmp";
      }
      pathToDownload = path.join("/tmp", "batch-download");
      if (!fs.existsSync(pathToDownload)) {
        fs.mkdirSync(pathToDownload);
      }
      return oss.downloadFileBatch(filenames, pathToDownload, function(err) {
        should.not.exist(err);
        return done();
      });
    });
    it("delete file should work", function(done) {
      var filename;
      filename = "just-a-test";
      return oss.deleteFile(filename, function(err) {
        should.not.exist(err);
        return done();
      });
    });
    return it("delete multiple files in a batch should work", function(done) {
      var filename;
      filename = "just-a-test";
      return oss.deleteFileBatch(FILE_NAMES, function(err) {
        should.not.exist(err);
        return done();
      });
    });
  });

}).call(this);