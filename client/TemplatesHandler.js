var fs = require('fs');

var Template = cc.$class({
    construct: function(name, content) {
      this.name = name;
      this.content = content;
    }
});

TemplatesHandler = cc.$class({
    construct: function (config) {
      this.templatesDir = config.get('templatesDir');
      this.javascriptsDir = config.get('javascriptsDir'); 
    },

    make: function () {
      fs.writeFileSync(this.javascriptsDir + 'templates.js', this.getCombined(), 'utf8');
    },

    getCombined: function () {
      if (!this.combined) {
        this.combined = this.combine();
      }
      return this.combined;
    },

    combine: function () {
      var combinedTemplates = "Templates = {};";
      _.each(this.getTemplates(), function (template) {
        combinedTemplates += 'Templates.' + template.name + ' = ' + JSON.stringify(template.content) + ';';
      }, this);
      return combinedTemplates;
    },

    getTemplates: function () {
      if (!this.templates) {
        this.templates = this.load();
      } 
      return this.templates;
    },

    load: function () {
      var templates = [];
      _.each(fs.readdirSync(this.templatesDir), function (templateFileName) {
        var content, name;
        content = fs.readFileSync(this.templatesDir + '/' + templateFileName, 'utf8');
        name = templateFileName.split('.')[0];
        templates.push(new Template(name, content));
      }, this);
      return templates;
    }
});

