var CascadeDeletePlugin = function(schema, options) {


        schema.pre('remove', function(preRemoveDone) {
                var doc = this;

                console.log('plugin::CascadeDeletePlugin::pre::remove::enter');
                var Model = $mongoose.model(options.childModel);

                var conditions = {};

                conditions[options.parentKey] = doc._id;

                Model.find(conditions).exec(function(err, chidren) {
                        $async.each(chidren, function(child, removeNextItem) {

                                child.remove(removeNextItem);

                        }, preRemoveDone);
                });
        });

}

module.exports = {
        plugin: CascadeDeletePlugin
};
