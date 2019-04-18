const annualHoliday = require('../models').annualHolidays

module.exports = {
  create (req, res) {
    return annualHoliday
      .create(
        {
          holidaydate: req.body.holidaydate,
          title: req.body.title,
          description: req.body.description
        })
      .then(annualHoliday => res.status(201).send(annualHoliday))
      .catch(error => res.status(400).send(error))
  },
  list (req, res) {
    return annualHoliday
      .findAll().then(annualHoliday => {
        res.send(annualHoliday)
      })
  },
  update (req, res) {
    const id = req.params.id
    return annualHoliday
      .update({
        holidaydate: req.body.holidaydate, title: req.body.title, description: req.body.description
      }, { where: { id: id } }
      ).then(() => {
        res.status(200).send('updated annual holiday')
      })
  }

}
